import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/services/test.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  txtArea1: string = '';
  txtArea2: string = '';

  optRadio: string = '';

  txtInput: string = '';
  txtOutPut: string = '';

  // jon to PHP
  inKey = 0;
  classesArray: string[] = [];

  constructor(private dataService: TestService) {
    this.optRadio = 'opt1';
    this.txtArea1 = 'Paste your JSON here:';
    this.txtArea2 = 'Your GO Struct is:';
  }

  async ngOnInit() {
    await this.getData();
    // console.log('despues de traer data 2');
  }

  async getData(){
      await this.dataService.traerData().toPromise().then(data =>{
        console.log(data);
        console.log('despues de traer data 1');
      })

      console.log('yo');
  }

  parseText() {

    this.txtOutPut = '';
    this.classesArray = [];

    if (this.txtInput === '') {
      return alert('Please, write the text to transform! =D');
    }

    switch (this.optRadio) {

      case 'opt1':
        this.jsonToGoStruct();
        break;
      case 'opt2':
        this.goStructToJson();
        break;
      case 'opt3':
        this.jsonToPhpClass();
        break;
    }
  }

  jsonToGoStruct() {
    try {
      const json = JSON.parse(this.txtInput);
      let struct = '';
      for (const property in json) {
        const typeData = typeof (json[property]);
        const typeDataGo = this.returnTypeData(typeData);
        struct = struct + `${this.capitalize(property)} ${typeDataGo} \`json:"${property}"\` \n`;
      }
      struct = `type object struct {${struct}}`
      this.txtOutPut = struct;
    } catch (error) {
      this.txtOutPut = error;
    }

  }

  goStructToJson() {
    const arrayStruct = this.txtInput.trim().split('');

    let find = '';
    let arrayKeys: string[] = [];
    let phrase = '';
    let object: any = {};

    arrayStruct.forEach(e => {
      if (e === ':') {
        find += e;
      }
      if (e === '"') {
        find += e;
      }
      if (find == ':"') {
        phrase += e;
      }
      if (find === ':""') {
        arrayKeys.push(phrase);
        find = '';
        phrase = '';
      }
    })
    let keys = arrayKeys.map(e => {
      e = e.replace('"', '');
      return e;
    })

    keys.forEach(e => {
      object[e] = "";
    })

    this.txtOutPut = JSON.stringify(object);
  }

  jsonToPhpClass() {

    let convert = {};
    let indentation = "  ";

    try {
      convert = JSON.parse(this.txtInput);
      const classes = this.createClasses(convert, "ClassName", indentation);
      this.txtOutPut = classes;
    } catch (e) {
      this.txtOutPut = e;
    }
  }

  parser(obj: { [x: string]: any; }, indent: any) {
    let output = "";
    let keys = Object.keys(obj);
    for (const i in keys) {

      switch (typeof obj[keys[i]]) {
        case 'string':
          (this.isDate(obj[keys[i]]) == 0) ? output = output + " public $" + keys[i] + "; // type string\n" : output = output + " public $" + keys[i] + "; // type date\n";
          break;

        case 'number':
          (this.isDouble(obj[keys[i]].toString())) ? output = output + " public $" + keys[i] + "; // type double\n" : output = output + " public $" + keys[i] + "; // type integer\n";
          break;

        case 'boolean':

          output = output + " public $" + keys[i] + "; // type bool \n";
          break;

        default:
          if (obj[keys[i]] instanceof Array) {
            let type = ''
            let n = obj[keys[i]];
            type = typeof n[0];
            let name = keys[i];
            let c = obj[keys[i]];
            let Cname = this.returnClaseName(name);
            if (type == "object") {
              output += " public $" + name + "; // type array of " + Cname + " \n";
              this.createClass(c[0], Cname, indent);
            } else {
              if (type == "string") {
                type = this.returnClaseName(type);
              }

              output += " public $" + name + ";  // type array of " + type + " \n";
            }

          } else if (obj[keys[i]] == null
            || obj[keys[i]] == undefined) {
            let type = '';
            let n = obj[keys[i]];
            type = typeof n[0];
            let name = keys[i];
            if (type == "string") {
              type = this.returnClaseName(type);
            }

            output += " public $" + name + "; // type array " + type + " \n";
          } else {
            let value = keys[i];
            let cap = this.returnClaseName(value);
            output = output + "public $" + value + "; //" + cap + "\n";
            this.createClass(obj[keys[i]], cap, indent);
          }

      }
    }
    return output;
  }

  createClass(obj: any, label: string, indentation: any) {
    let classText = "class " + label + " {\n";
    classText = classText + this.parser(obj, indentation) + "\n}";
    this.classesArray.push(classText);
  }

  createClasses(obj: {}, startingLabel: string, indentation: string) {
    this.createClass(obj, startingLabel, indentation);
    return this.classesArray.join("\n");
  }

  isDouble(n: string) {

    let regx = /[.]/g;

    for (var j = 0; j < n.length; j++) {

      let i = n[j].charCodeAt(0);
      if (n[j] == ".") {

        if (j != 0) {
          j = j - 1;
        }
        break;
      }

      if (i > 48 && i < 58) {

        break;
      }
    }

    n = n.slice(j);
    return regx.test(n);

  }

  isDate(n: string) {

    let valid = 1;
    var regx = new Date(n);
    var f = new Date();

    if (typeof (regx) !== typeof (f)) {
      valid = 0;
    }

    if (n.length < 6) {
      valid = 0;
    }
    return valid;
  }

  returnClaseName(keys: string | any[]) {
    let index = 0;
    let res_str = "";
    for (let i = 0; i < keys.length; i++) {
      let n = keys[i].charCodeAt(0);

      if ((n > 64 && n < 123)) {

        if (index == 0) {
          res_str = res_str + keys[i];
        } else {
          index = 0;
          res_str = res_str + keys[i].toUpperCase();
        }

      } else {

        index = 1;
      }
    }

    let keyNames = res_str[0].toUpperCase() + res_str.slice(1);
    return keyNames;
  }

  chgOpt() {
    this.txtOutPut = '';
    this.txtInput = '';

    if (this.optRadio === 'opt1') {
      this.txtArea1 = 'Paste your JSON here:';
      this.txtArea2 = 'Your GO Struct is:';
    } else if (this.optRadio === 'opt2') {
      this.txtArea1 = 'Paste your Go Struct here:';
      this.txtArea2 = 'Your JSON is:';
    } else if (this.optRadio === 'opt3') {
      this.txtArea1 = 'Paste your JSON here:';
      this.txtArea2 = 'Your PHP class is:';
    }
  }

  downloadFile() {
    if (this.txtOutPut.trim() === '') {
      alert('Nothing for download...');
      return;
    }

    if (this.optRadio === 'opt1') {
      this.download("file.go", this.txtOutPut);
    } else if (this.optRadio === 'opt2') {

    } else if (this.optRadio === 'opt3') {
      this.download("file.php", "<?php\n" + this.txtOutPut);
    }
  }

  // UTILS FUNCTIONS
  returnTypeData(typeData: any): string {
    switch (typeData) {
      case 'string':
        return 'string'
      case 'number':
        return 'int'
      default:
        return 'string';
    }
  }

  capitalize(word: string) {
    return word[0].toUpperCase() + word.slice(1);
  }

  download(filename: any, textInput: any) {

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}


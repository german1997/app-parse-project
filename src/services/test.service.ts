import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private http: HttpClient
  ) { }


  traerData(){
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=%22.%24address.%22&key=AIzaSyC6X6gR-eTNi9O6JTmlTPrVSqXipusXIIY');
  }
}

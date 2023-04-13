import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  log(message:string) {
    console.log(message);
  }

  teste(msg: string) {
    console.log('msg padrão')
  }

}

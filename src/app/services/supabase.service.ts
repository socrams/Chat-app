import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

const CHAT_DB = 'chat';


export interface Chat {
  id: number;
  created_at: string;
  user: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class SupabaseService {
  supabase:SupabaseClient;
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject (null);
  private _chat: BehaviorSubject<any> = new BehaviorSubject ([]);

  constructor(public router:Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey,{
      //autoRefreshToken: true,
      //persistSession:true,
    });
    this.supabase.auth.onAuthStateChange(( event,session )=>{
      if (event == 'SIGNED_IN'){
        this._currentUser.next(session.user);
        this.loadChats();
        this.cambiosChat();
      }else{
        this._currentUser.next(false);
      }
    });
  }

  async salirUsuario(){
    await  this.supabase.auth.signOut();

    this.supabase.getSubscriptions().map(sup => {this.supabase.removeSubscription(sup);
    });
    this.router.navigateByUrl('/');
  }

  async registrarUsuario(credenciales: {email: any, password: any, nombre:any, apellido:any }){

    return new Promise ( async (resolve, reject) => {
      const { error, session } = await this.supabase.auth.signUp(credenciales)
      if ( error ) {
        reject ( error );
      }else{
        resolve ( session );
        this.datosUsuario(credenciales);
      }
      });
    }

  ingresarUsuario(credenciales: { email, password } ) {
    return new Promise ( async (resolve, reject) => {
      const { error, session } = await this.supabase.auth.signIn(credenciales)
      if ( error ) {
        reject ( error );
      }else{
        resolve ( session );
      }
    });
  }

  get chat(): Observable <Chat[] > {
    return this._chat.asObservable();
  }

  async loadChats(){
    const query = await this.supabase.from(CHAT_DB).select('*');
    this._chat.next(query.data);
  }

  async datosUsuario(credenciales:{email:any, nombre:any, apellido:any}){      
    const supabase =  createClient(environment.supabaseUrl, environment.supabaseKey);
    const { error } = await this.supabase
    .from('profiles')
    .insert([
      { nombre: credenciales.nombre,apellido: credenciales.apellido, mail:credenciales.email},
    ])  
  }

  cambiosChat() { //quitar evento update y delete.
    this.supabase.from(CHAT_DB).on('*', payload => {
      console.log('cambios: ', payload);
      if (payload.eventType == 'INSERT') {
        const newItem: Chat = payload.new;
        this._chat.next([...this._chat.value, newItem]);
      } else if (payload.eventType == 'UPDATE') {
        const updatedItem: Chat = payload.new;
        const newValue = this._chat.value.map(item => {
          if (updatedItem.id == item.id) {
            item = updatedItem;
          }
          return item;
        })
        this._chat.next(newValue);
      }
    }).subscribe();
  }

}

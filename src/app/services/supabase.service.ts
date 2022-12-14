import { Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

const CHAT_DB = 'chat';

export interface Chat {
  created_at: Date;
  id: number;
  message: string;
  user: string;
  localidad: string;
}

@Injectable({
  providedIn: 'root'
})

export class SupabaseService {
  supabase:SupabaseClient;
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject (null);
  private _chat: BehaviorSubject<any> = new BehaviorSubject ([]);


  constructor( public router:Router ) {
    //  this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey,{
    //    autoRefreshToken: true,
    //    persistSession:true,
    //  });
    
    this.conexion();
    this.supabase.auth.onAuthStateChange(( event,session ) => {
      if (event == 'SIGNED_IN'){
        this._currentUser.next(session.user);
        this.loadChats();
        this.cambiosChat();
      }else{
        this._currentUser.next(false);
      }
    });
  }

 conexion(): void {
   this.supabase =  createClient(environment.supabaseUrl, environment.supabaseKey,{
       db: {
         schema: 'public'
       },
       auth: {
         persistSession: true
       }
     });
   }

  async getUser(){
    const { data: { session } } = await this.supabase.auth.getSession();
    return session.user.email;



  }

  async salirUsuario(){
    await  this.supabase.auth.signOut();

    //this.supabase.getSubscriptions().map(sup => {this.supabase.removeSubscription(sup)});
    this.router.navigateByUrl('/');
  }

  async registrarUsuario(credenciales: {email: any, password: any, nombre:any, apellido:any, fecha:any }){
    return new Promise ( async (resolve, reject) => {
//      const { error, session } = await this.supabase.auth.signUp(credenciales)
      const { data: { user }, error } = await this.supabase.auth.signUp(credenciales);
      if ( error ) {
        reject ( error );
      }else{
        resolve ( user );
        this.datosUsuario(credenciales);
      }});
    }

  ingresarUsuario(credenciales: { email, password } ) {
    return new Promise ( async (resolve, reject) => {
      // const { error, session } = await this.supabase.auth.signIn(credenciales)
      const { data: { user }, error } = await this.supabase.auth.signInWithPassword(credenciales)
      if ( error ) {
        reject ( error );
      }else{
        resolve ( user );
      }
    });
  }

  
  async loadChats(){
    const query = await this.supabase.from(CHAT_DB).select('*');
    this._chat.next(query.data);
  }
  
  async datosUsuario(credenciales:{email:any, nombre:any, apellido:any}){
    const supabase =  createClient(environment.supabaseUrl, environment.supabaseKey,{
      db: {
        schema: 'public'
      },
      auth: {
        persistSession: true
      }
    })
    // this.conexion();
    //const supabase =  createClient(environment.supabaseUrl, environment.supabaseKey);
    const { error } = await this.supabase
    .from('profiles')
    .insert([{
      nombre: credenciales.nombre,
      apellido: credenciales.apellido,
      mail:credenciales.email},
    ])
    console.log("datosUsuarios: ",
    credenciales.nombre,
    " ", credenciales.apellido,
    " ", credenciales.email,
    );
  }
  // this.supabase.auth.user()?.email
  
  cambiosChat() { //quitar evento update y delete.
    this.supabase.channel('all-users-changes')
    .on('postgres_changes',
    { event: '*', schema: 'public', table: 'chat' },
    (payload) => {
      console.log("payload: ", payload);
      if (payload.eventType == 'INSERT'){
        const nuevoChat = payload.new;
        this._chat.next([...this._chat.value, nuevoChat]);
      }
    }).subscribe()
  }

  get chat(): Observable <Chat[] > {
    return this._chat.asObservable();
  }
            
            
}

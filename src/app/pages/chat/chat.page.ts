import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { createClient, AuthUser } from "@supabase/supabase-js";
import { SupabaseService } from 'src/app/services/supabase.service';
import { environment } from 'src/environments/environment.prod';

// export interface CurrentSession {
//   currentSession: Aboutme;
// }
export interface Aboutme {
  user: User;
}
export interface User {
  email: string;
}
// export interface datos {
//   nombre:string;
//   apellido:string;
//   edad:any;
//   mail:any;
// }

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})

export class ChatPage implements OnInit {
  message: string;
  //conversacion: string = '';
  chats = this.supabaseService.chat;
  //public supabase;
  public mailLocal : string;

  @ViewChild(IonContent, {read: IonContent, static: false}) mycontent: IonContent;

  constructor(private supabaseService: SupabaseService) { 
    this.scrollToBottomOnInit();
  }
  

  async enviarMessage() {
    const supabase = createClient(environment.supabaseUrl,environment.supabaseKey);
    const { data , error } = await  supabase
    .from('chat')
    .insert(
      // { message: this.message , user: supabase.auth.user().email },
      { message: this.message ,
        user: (await this.supabaseService.getUser()
      )});      
      this.message = '';
      this.scrollToBottomOnInit();
    }

  async mensajes(){
    // this.supabase = this.supabaseService.conexion();
    // const { data: { session }, error } = await this.supabase.au
    // console.log(session, error);
    // return session.user.email;
    const email:Aboutme = JSON.parse(localStorage.getItem('sb-filfcskyxdjbkboinpgy-auth-token'));
    this.mailLocal = email.user.email;
    //console.log(this.mailLocal);
    
  }

  salir(){
    this.supabaseService.salirUsuario();
  }
  
  ngOnInit():void{
    this.mensajes();
    this.scrollToBottomOnInit();
    }

    
    scrollToBottomOnInit  () {
      setTimeout(() => {
          if (this.mycontent.scrollToBottom) {
              this.mycontent.scrollToBottom(400);
          }
      }, 500);
  }
}

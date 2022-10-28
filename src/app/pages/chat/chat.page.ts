import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { createClient } from "@supabase/supabase-js";
import { SupabaseService } from 'src/app/services/supabase.service';
import { environment } from 'src/environments/environment.prod';

export interface CurrentSession {
  currentSession: currentSession;
}
export interface currentSession {
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
  conversacion: string = '';
  chats = this.supabaseService.chat;
  public supabase;
  public mailLocal : string;

  @ViewChild(IonContent, {read: IonContent, static: false}) mycontent: IonContent;

  constructor(private supabaseService: SupabaseService) { }


  async enviarMessage() {
    const supabase = createClient(environment.supabaseUrl,environment.supabaseKey)
    const {data, error } = await  supabase
    .from('chat')
    .insert(
      { message: this.message , user: supabase.auth.user().email },
      );
      this.message = '';
      this.scrollToBottomOnInit();
    }

  mensajes(){
    const email:CurrentSession = JSON.parse(localStorage.getItem('supabase.auth.token'));
    this.mailLocal = email.currentSession.user.email;
  }
  salir(){
    this.supabaseService.salirUsuario();
  }
  
  ngOnInit():void{
    this.mensajes();
    this.scrollToBottomOnInit();
    }

    
    scrollToBottomOnInit() {
      setTimeout(() => {
          if (this.mycontent.scrollToBottom) {
              this.mycontent.scrollToBottom(400);
          }
      }, 500);
  }
}

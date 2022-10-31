import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { createClient, AuthUser } from "@supabase/supabase-js";
import { SupabaseService } from 'src/app/services/supabase.service';
import { environment } from 'src/environments/environment.prod';

export interface Aboutme {
  user: User;
}
  interface User {
    email: string;
  }

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})

export class ChatPage implements OnInit{
  message: string;
  chats = this.supabaseService.chat;
  public mailLocal : string;
  
  @ViewChild(IonContent, {read: IonContent, static: false}) mycontent: IonContent;

  constructor(private supabaseService: SupabaseService) {
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
    const email: Aboutme = JSON.parse(localStorage.getItem('sb-filfcskyxdjbkboinpgy-auth-token'));
    this.mailLocal = email.user.email;
    //console.log(this.mailLocal);
    this.scrollToBottomOnInit();
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

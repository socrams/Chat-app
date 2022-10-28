import { Component, OnInit } from '@angular/core';

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
  //misdatos = new datos<any>;
  public mailLocal : string;

  @ViewChild(IonContent, {read: IonContent, static: false}) mycontent: IonContent;

  constructor(private supabaseService: SupabaseService) {
    
  }
  // async read(){
  //   this.supabaseService.supabase;
  //   this.misdatos= await this.supabaseService.supabase
  // .from('profiles')
  // .select('*');
  // this.misdatos.nombre;
  // }

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
    //console.log('email: ',email.currentSession.user.email);
    this.mailLocal = email.currentSession.user.email;
  }
  salir(){
    this.supabaseService.salirUsuario();
  }
  ngOnInit():void{
    this.mensajes();
    this.scrollToBottomOnInit();
      // document.getElementById("ver").focus();
    }

    
    scrollToBottomOnInit() {
      setTimeout(() => {
          if (this.mycontent.scrollToBottom) {
              this.mycontent.scrollToBottom(400);
          }
      }, 500);
  }
}

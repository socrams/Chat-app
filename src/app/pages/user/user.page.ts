import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  
  constructor(private router: Router,
    private supabaseService:SupabaseService) {

  }

  ngOnInit() {
  }

  goChat(){
    this.router.navigateByUrl('/chat');
  }

  salir(){
    this.supabaseService.salirUsuario();
  }

  guardarCambios(){
    this.supabaseService.leerDatosUsuario();

  }
}

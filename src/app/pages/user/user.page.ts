import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/services/supabase.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  nombre: string;
  apellido: string;
  mail:string;
  edad: number;
  localidad: string;
  supabase:SupabaseClient;


  constructor(private router: Router,
    private supabaseService:SupabaseService) {
      this.leerDatosUsuario();
  }

  ngOnInit() {
  }

  goChat(){
    this.router.navigateByUrl('/chat');
  }

  salir(){
    this.supabaseService.salirUsuario();
  }

  async guardarCambios(){  
    const supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
     const { data, error } = await supabase
     .from('profiles')
     .update( { 
      nombre: this.nombre, apellido:this.apellido, edad: this.edad, localidad: this.localidad})
    // .eq('mail', this.supabaseService.supabase.auth.user()?.email);
     .eq('mail', this.mail);
    // console.log("datos: ", data, "| user ", user);
  }
  
  async leerDatosUsuario(){
    const supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    const {data : profiles, error}  = await supabase
    .from('profiles')
    .select('*')
    .like('mail', await this.supabaseService.getUser());
    profiles.forEach((element) => {
    this.nombre = element.nombre;
    this.apellido = element.apellido;
    this.mail = element.mail;    
    this.edad = element.edad;
    this.localidad = element.localidad;
    })
  }
  

}

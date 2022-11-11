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
  //edad: number;
  localidad: string;
  supabase:SupabaseClient;
  fecha: Date ;
  edad1: number;


  constructor(private router: Router, private supabaseService:SupabaseService) {
    this.leerDatosUsuario();
  }

  ngOnInit() {
    //this.leerDatosUsuario();
  }


  calcularEdad(){
      const convertAge = new Date(this.fecha);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.edad1 = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
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
      nombre: this.nombre, apellido:this.apellido, localidad: this.localidad, fecha: this.fecha})
    // .eq('mail', this.supabaseService.supabase.auth.user()?.email);
     .eq('mail', this.mail);
    // console.log("datos: ", data, "| user ", user);
    this.leerDatosUsuario()
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
    this.localidad = element.localidad;
    this.fecha = element.fecha;
    })
    
    // var arr = this.mail.split("@");
    // this.mail = arr[0];
    this.calcularEdad();
  }
  

}

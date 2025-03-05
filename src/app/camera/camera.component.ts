import { Component, inject } from '@angular/core';
import { CameraService } from './services/camera.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent {
  cameraService: CameraService = inject(CameraService);
  imgUrl: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  
  // Galería de imágenes
  imageGallery: string[] = [];
  selectedImage: string | null = null;

  async takePicture() {
    this.errorMessage = ''; 
    try {
      this.loading = true;
      this.imgUrl = await this.cameraService.takePicture();
      if (!this.imgUrl) {
        throw new Error('No se obtuvo una imagen válida');
      }

      // Añadir la imagen a la galería
      this.imageGallery.unshift(this.imgUrl);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      this.loading = false;
    } catch (error) {
      console.error('Error al capturar imagen:', error);
      this.errorMessage = String(error);
      this.imgUrl = '';
      this.loading = false;
    }
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  deleteImage(index: number) {
    // Primero verificamos si la imagen a borrar es la seleccionada
    if (this.selectedImage === this.imageGallery[index]) {
      this.selectedImage = null;
    }
    
    // Luego eliminamos la imagen de la galería
    this.imageGallery.splice(index, 1);
  }

  clearGallery() {
    this.imageGallery = [];
    this.selectedImage = null;
  }
}
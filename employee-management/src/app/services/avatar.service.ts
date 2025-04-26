import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly avatarColors = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33F3',
    '#33FFF3', '#F3FF33', '#FF3333', '#33FF33', '#3333FF'
  ];

  private readonly avatarShapes = [
    'circle', 'square', 'triangle', 'diamond', 'star'
  ];

  generateRandomAvatar(): string {
    const color = this.avatarColors[Math.floor(Math.random() * this.avatarColors.length)];
    const shape = this.avatarShapes[Math.floor(Math.random() * this.avatarShapes.length)];
    
    // Using a simple SVG-based avatar
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <${shape} x="10" y="10" width="80" height="80" fill="${color}" />
      </svg>
    `)}`;
  }
} 
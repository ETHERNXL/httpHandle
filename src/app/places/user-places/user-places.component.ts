import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  //places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private placesService = inject(PlacesService);
  private destroyRef = inject(DestroyRef);

  places = this.placesService.loadedUserPlaces;
  ngOnInit() {
    this.isFetching.set(true);
    const subs = this.placesService.loadUserPlaces().subscribe({
      error: (error: Error) => this.error.set(error.message),
      complete: () => {
        this.isFetching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subs.unsubscribe();
    });
  }
  OnremoveUserPlace(place:Place){
    const subs = this.placesService.removeUserPlace(place).subscribe();

    this.destroyRef.onDestroy(() => {
      subs.unsubscribe();
    });
  }

}

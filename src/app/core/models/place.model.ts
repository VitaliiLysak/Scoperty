export interface Place {
   native: google.maps.Marker;
   onclick: Function;
   onmouseover: Function;
   onmouseout: Function;
   onclickListener: google.maps.MapsEventListener;
   onmouseoverListener: google.maps.MapsEventListener;
   onmouseoutListener: google.maps.MapsEventListener;
   isActive: boolean;
}

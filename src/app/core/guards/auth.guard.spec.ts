// import {
//   TestBed,
//   async, inject
// } from '@angular/core/testing';

// import { RouterTestingModule } from '@angular/router/testing';
// import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { DialogService } from 'ng2-bootstrap-modal';

// import { AuthGuardService } from './auth-guard';
// import { AuthService } from '../services/auth';
// import { OpenModalService } from '../services/open-modal';

// describe('Resolver: AuthGuardService', () => {

//   let route: ActivatedRouteSnapshot;
//   let state: RouterStateSnapshot;

//   let authService: AuthService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         AuthService,
//         DialogService,
//         OpenModalService,
//         AuthGuardService,
//       ],
//       imports: [RouterTestingModule]
//     });

//     route = new ActivatedRouteSnapshot();
//     state = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);

//     authService = TestBed.get(AuthService);
//   });

//   it('Сhecks if a user is logged out',
//     async(inject([AuthGuardService, Router], (auth, router) => {
//         spyOn(router, 'navigate');
//         spyOn(authService, 'isUserLoggedIn').and.returnValue(false);
//         expect(auth.canActivate(route, state)).toBeFalsy();
//         expect(router.navigate).toHaveBeenCalled();
//       })
//     ));

//   it('Сhecks if a user is logged in',
//     async(inject([AuthGuardService, Router], (auth, router) => {
//         spyOn(authService, 'isUserLoggedIn').and.returnValue(true);
//         expect(auth.canActivate(route, state)).toBeTruthy();
//       })
//     ));
// });

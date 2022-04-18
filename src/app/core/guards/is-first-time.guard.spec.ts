// import { TestBed, async, inject } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
// import { DialogService } from 'ng2-bootstrap-modal';

// import { IsFirstTimeGuardService } from './is-first-time';
// import { AuthService } from '../services/auth';
// import { OpenModalService } from '../services/open-modal';

// describe('Resolver: IsFirstTimeGuardService', () => {

//   let route: ActivatedRouteSnapshot;
//   let state: RouterStateSnapshot;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         AuthService,
//         DialogService,
//         OpenModalService,
//         IsFirstTimeGuardService,
//       ],
//       imports: [RouterTestingModule]
//     });

//     route = new ActivatedRouteSnapshot();
//     state = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);
//   });

//   it('Сhecks if url is not valid',
//     async(inject([IsFirstTimeGuardService, Router], (auth, router) => {
//         spyOn(router, 'navigate');
//         state.url = '/some_address';
//         expect(auth.canActivate(route, state)).toBeFalsy();
//         expect(router.navigate).toHaveBeenCalled();
//       })
//     ));

//   it('Сhecks if url is \'/\'',
//     async(inject([IsFirstTimeGuardService, Router], (auth, router) => {
//         spyOn(router, 'navigate');
//         state.url = '/';
//         expect(auth.canActivate(route, state)).toBeTruthy();
//       })
//     ));

//   it('Сhecks if url contains \'confirmuser\'',
//     async(inject([IsFirstTimeGuardService, Router], (auth, router) => {
//         spyOn(router, 'navigate');
//         state.url = 'confirmuser';
//         expect(auth.canActivate(route, state)).toBeTruthy();
//       })
//     ));

//   it('Сhecks if url contains \'changepassword\'',
//     async(inject([IsFirstTimeGuardService, Router], (auth, router) => {
//         spyOn(router, 'navigate');
//         state.url = 'changepassword';
//         expect(auth.canActivate(route, state)).toBeTruthy();
//       })
//     ));

//   it('Сhecks if localStorage.hasAlreadyLooked is exists',
//     async(inject([IsFirstTimeGuardService, Router], (auth, router) => {
//         spyOn(router, 'navigate');
//         state.url = '/some_address';
//         localStorage.hasAlreadyLooked = true;
//         expect(auth.canActivate(route, state)).toBeTruthy();
//         localStorage.removeItem('hasAlreadyLooked');
//       })
//     ));
// });

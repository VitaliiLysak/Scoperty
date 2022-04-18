import {
  trigger,
  style,
  animate,
  transition,
  AnimationTriggerMetadata,
} from '@angular/animations';

const POPUP_ANIMATIONS_DESKTOP: AnimationTriggerMetadata[] = [
  trigger('popupSlideInFromBottom', [
    transition(
      ':enter',
      [
        style({
          transform: 'translateY(100%)',
          opacity: 0,
        }),
        animate('0.3s', style({
          transform: 'translateY(0)',
          opacity: 1,
        })),
      ],
    ),
    transition(
      ':leave',
      [
        style({
          transform: 'translateY(0)',
          opacity: 1,
        }),
        animate('0.3s', style({
          transform: 'translateY(100%)',
          opacity: 0,
        })),
      ],
    ),
  ]),
];

const POPUP_ANIMATIONS_MOBILE: AnimationTriggerMetadata[] = [
  trigger('popupSlideInFromTop', [
    transition(
      ':enter',
      [
        style({
          transform: 'translateY(-100%)',
          opacity: 0,
        }),
        animate('0.3s', style({
          transform: 'translateY(0)',
          opacity: 1,
        })),
      ],
    ),
    transition(
      ':leave',
      [
        style({
          transform: 'translateY(0)',
          opacity: 1,
        }),
        animate('0.3s', style({
          transform: 'translateY(-100%)',
          opacity: 0,
        })),
      ],
    ),
  ]),
];

export const POPUP_ANIMATIONS: AnimationTriggerMetadata[] = [
  ...POPUP_ANIMATIONS_DESKTOP,
  ...POPUP_ANIMATIONS_MOBILE,
];

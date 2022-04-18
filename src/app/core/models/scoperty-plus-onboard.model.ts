export interface OnBoardingStep {
  label: string;
  data: OnBoardingStepData;
}

export interface OnBoardingStepData {
  [key: string]: {
    value?: any,
    validations: any
  };
}

export const STEPS_THAT_CHECK_USER_LOGGED_IN = [6, 7, 8];

export const STEPS_WHERE_NAV_BOX_IS_HIDDEN = [5, 12, 13];
export const STEPS_WHERE_NAV_BOX_IS_EDITABLE = [0, 1, 2, 3, 4, 5, 6, 14];

export const STEPS_WHERE_CONFIRM_WINDOW_SHOULD_NOT_SHOW = [0, 12, 13];

export const STEPS_OF_FIRST_STEP = [0, 1, 2, 3, 4, 5];
export const STEPS_OF_SECOND_STEP = [6, 7, 8];
export const STEPS_OF_THIRD_STEP = [9, 10, 11, 12, 13];

export const STEPS_FINAL = [12, 13];

export const FIELDS_NOT_SENT_TO_BE = ['address_city', 'mortgage_certificate_name', 'mortgage_certificate_type'];

export const STEP_ITEMS: OnBoardingStep[] = [
  // Step1

  // Substep0
  {
    label: 'Welche Art von Immobilie möchtest du kaufen?',
    data: {
      property_type: {
        validations: {},
        value: {
          house: 'single_family_house',
          apartment: 'apartment'
        }
      }
    }
  },
  // Substep1
  {
    label: 'Wie groß soll die Wohnfläche mindestens sein?',
    data: {
      living_area: {
        validations: {},
        value: '100'
      }
    }
  },
  // Substep2
  {
    label: 'Wieviele Zimmer suchst du?',
    data: {
      number_of_rooms: {
        validations: {},
        value: [1, 2, 3, 4, 5, 6]
      }
    }
  },
  // Substep3
  {
    label: 'Was ist dir wichtig?',
    data: {
      has_balcony: {
        validations: {},
      },
      has_terrace: {
        validations: {},
      },
      has_garden: {
        validations: {},
      },
    }
  },
  // Substep4
  {
    label: 'Wo suchst du?',
    data: {
      coordinates_lat: {
        validations: {},
      },
      coordinates_lng: {
        validations: {},
      },
      address_line: {
        validations: {},
      },
      address_city: {
        validations: {},
      },
      zoom: {
        validations: {},
      },
      radius: {
        validations: {},
      }
    }
  },
  // Substep 5
  {
    label: '',
    data: null
  },
  // Step 2

  // Substep6
  {
    label: 'In der letzten Woche hatten wir <b>{quantity} exklusive Exposés</b>, die deinen Suchkriterien entsprechen!',
    data: {
      email: {
        validations: {}
      }
    }
  },
  // Substep7
  {
    label: 'Zur Nutzung von Scoperty Plus registriere dich bei Scoperty!',
    data: null
  },
  // Substep8
  {
    label: 'Zur Nutzung von Scoperty Plus melde dich mit deinem Scoperty Konto an!',
    data: {
      sub: {
        validations: {}
      }
    }
  },
  // Substep9
  {
    label: 'Fast geschafft! Deine Eintrittskarte zu Scoperty Plus.',
    data: null
  },
  // Substep10
  {
    label: 'Das Hochladen war erfolgreich!',
    data: {
      mortgage_certificate_name: {
        validations: {}
      },
      mortgage_certificate_type: {
        validations: {}
      },
      mortgage_certificate: {
        validations: {}
      }
    }
  },
  // Substep11
  {
    label: 'Kein Problem! Wir helfen dir den richtigen Finanzierungsrahmen zu finden.',
    data: {
      phone_number: {
        validations: {
          pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}'
        }
      },
      call_at: {
        validations: {}
      }
    }
  },
  // Substep12
  {
    label: 'Glückwunsch!<br>Wir haben deinen Nachweis erhalten!',
    data: null
  },
  // Substep13
  {
    label: 'Glückwunsch!<br>Wir haben deinen Rückruf-Termin erhalten!',
    data: null
  },

  // OPTIONAL STEPS

  // Substep14
  {
    label: null,
    data: null
  },
];

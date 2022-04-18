import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { of, Subscription, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, flatMap, map } from 'rxjs/operators';

import { StaticStorageService } from '../../../../core/services/static-storage.service';
import { templateStatusToFrontend } from '../../../../shared/utils/deserializator.util';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  @ViewChild('messageField') messageField: ElementRef;

  public _name: string = 'chat';
  public activeChat: string = null;
  public fullName: string = null;
  public filterListByNameSubscription: Subscription = null;
  public keyUpSearchField = new Subject<string>();
  public messageValue: string = null;
  public hintShouldBeClosen: boolean = false;
  public chatList = [];
  public activeChatHistory = [];
  public initialFilterValue = [{id: 3, text: 'Alle', textBe: 'all'}];
  public mockPeopleMessageData = [
    {
      fullName: 'Anna Rose',
      name: 'Anna',
      date: '24 Jul',
      time: '08:31',
      street: 'Blumenstraße',
      streetNumber: '9',
      city: 'München',
      code: '80796',
      floorNumber: '8',
      propertyType: 'Haus',
      livingSurface: '120',
      sellingStatus: 'ForSale',
      price: 2000000,
      role: 'owner',
      chat: [],
      unreadMessages: false
    },
    {
      fullName: 'Gustav Edward',
      name: 'Gustav',
      date: '24 Jul',
      time: '08:33',
      street: 'Blumenstraße',
      streetNumber: '9',
      city: 'München',
      code: '45663',
      floorNumber: '6',
      propertyType: 'Wohnung',
      livingSurface: '130',
      sellingStatus: 'MakeMeMove',
      price: 1500000,
      role: 'owner',
      chat: [],
      unreadMessages: true
    },
    {
      fullName: 'Maria Josefphine',
      name: 'Maria',
      date: '24 Jul',
      time: '08:32',
      street: 'Leopoldstraße',
      streetNumber: '5',
      city: 'München',
      code: '84496',
      floorNumber: '3',
      propertyType: 'Wohnung',
      livingSurface: '150',
      sellingStatus: 'Active',
      price: 340000,
      role: 'buyer',
      chat: [],
      unreadMessages: true
    },
    {
      fullName: 'Andreas Welt',
      name: 'Andreas',
      date: '24 Jul',
      time: '08:45',
      street: 'Leopoldstraße',
      streetNumber: '9',
      city: 'München',
      code: '80796',
      floorNumber: '5',
      propertyType: 'Wohnung',
      livingSurface: '222',
      sellingStatus: 'Active',
      price: 450000,
      role: 'buyer',
      chat: [],
      unreadMessages: true
    },
    {
      fullName: 'Faina Edward',
      name: 'Faina',
      date: '24 Jul',
      time: '08:33',
      street: 'Blumenstraße',
      streetNumber: '9',
      city: 'München',
      code: '45663',
      floorNumber: '6',
      propertyType: 'Wohnung',
      livingSurface: '130',
      sellingStatus: 'MakeMeMove',
      price: 1500000,
      role: 'buyer',
      chat: [],
      unreadMessages: false
    },
  ];
  public chatContentShown: boolean = false;
  public sellingStatus = 'ForSale';

  private filterChatList(field, value): void {
    for (let i = 0; i < this.mockPeopleMessageData.length; i++) {
      this.chatList = this.mockPeopleMessageData.filter((person) => {
        return person[field].toUpperCase().includes(value.toUpperCase());
      });
    }
  }

  private scrollChatToBottom() {
    const chatBlock = document.getElementById('chat-area');
    setTimeout(() => {
      chatBlock.scrollTop = chatBlock.scrollHeight - chatBlock.clientHeight;
    }, 0);
  }

  constructor(
    public staticStorage: StaticStorageService,
    private analyticsService: AnalyticsService,
  ) {}

  public ngOnInit() {
    this.chatList = this.mockPeopleMessageData.slice();
    this.activeChat = this.mockPeopleMessageData[0].name;
    const mockedMessagesList = [
      {
        text: 'Hallo Herr Huber, ich hätte Interesse an Ihren Objekt? Würden Sie mir noch ' +
        'ein wenig im Preis entgegenkommen? Wann hätten Sie denn mal Zeit damit ich das Objekt ' +
        'besichtigen könnte? Vielen Dank. Herzliche Grüße, Maria',
        date: '12:56',
        sender: 'Anna Rose',
        recipient: 'me'
      },
      {
        text: 'Hallo Herr Huber, ich hätte Interesse an Ihren Objekt? Würden Sie mir noch ' +
        'ein wenig im Preis entgegenkommen? Wann hätten Sie denn mal Zeit damit ich das Objekt ' +
        'besichtigen könnte? Vielen Dank. Herzliche Grüße, Maria',
        date: '12:57',
        sender: 'me',
        recipient: 'Anna Rose'
      },
      {
        text: 'Hallo Herr Huber, ich hätte Interesse an Ihren Objekt? Würden Sie mir noch ' +
        'ein wenig im Preis entgegenkommen? Wann hätten',
        date: '12:58',
        sender: 'Anna Rose',
        recipient: 'me'
      },
    ];
    this.mockPeopleMessageData[0].chat = mockedMessagesList;
    this.activeChatHistory = this.mockPeopleMessageData[0].chat;

    this.filterListByNameSubscription = this.keyUpSearchField
      .pipe(
        map(e => (<HTMLInputElement>event.target).value),
        debounceTime(1000),
        distinctUntilChanged(),
        flatMap(search => {
          return of(search)
            .pipe(
              delay(500),
            );
        }),
      )
      .subscribe(val => this.filterChatListByName(val));
  }

  public filterChatListByRole(event): void {
    const val = event.text === 'Kaufinteressent' ? 'buyer' : event.text === 'Eigentümer' ? 'owner' : '';
    this.filterChatList('role', val);
  }

  public filterChatListByName(val): void {
    this.filterChatList('name', val);
  }

  public goToChat({name, chat, fullName}): void {
    this.activeChat = name;
    this.fullName = fullName;
    this.activeChatHistory = chat;
    const index = this.mockPeopleMessageData.findIndex((item) => item.name === this.activeChat );
    this.mockPeopleMessageData[index].unreadMessages = false;
    this.chatContentShown = true;

    // workaround for header on iOS, maybe rework chat-content as a separate modal component
    document.getElementsByTagName('app-layout-header')[0].classList.add('header_hidden');

    this.scrollChatToBottom();
  }

  public closeChat() {
    document.getElementsByTagName('app-layout-header')[0].classList.remove('header_hidden');
    this.chatContentShown = false;
  }

  public closeHint(): void {
    this.hintShouldBeClosen = true;
  }

  // @FIXME: when API is ready
  public sendMessage(): void {
    if (this.messageValue) {
      const newMessage = {
        text: this.messageValue,
        date: '13:01',
        sender: 'me',
        recipient: this.activeChat
      };
      const index = this.mockPeopleMessageData.findIndex((item) => item.name === this.activeChat );
      this.mockPeopleMessageData[index].chat.push(newMessage);
      this.messageValue = '';
      this.messageField.nativeElement.focus();
    }

    this.analyticsService.triggerFormSubmissionSuccess('chatForm', 'send-message-to-chat');

    this.scrollChatToBottom();
  }

  public getSellingStatusName(sellingStatus: string): string {
    return templateStatusToFrontend(sellingStatus);
  }
}

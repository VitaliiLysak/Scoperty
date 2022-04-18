import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FilterOptions } from '../../../../core/models/filter-options.model';
import { DebitInterestService } from '../../../../core/services/debit-interest.service';
import { MapFilterStorageService } from '../../../../core/services/map-filter-storage.service';
import calculateTotalMortgagePrice from '../../../../shared/utils/calculate-total-mortgage-price.util';
import { CITIES } from '../../../../main/main.constants';

const NUREMBERG_AVERAGE_RENT: number = 900;

@Component({
  selector: 'app-start-page-calculate-mortgage',
  templateUrl: './start-page-calculate-mortgage.component.html',
  styleUrls: ['./start-page-calculate-mortgage.component.css']
})
export class StartPageCalculateMortgageComponent implements OnInit {
  public name: string = 'start-page-calculate';
  public currentAffordPrice: number = NUREMBERG_AVERAGE_RENT;
  public tooltipText: string = '';
  private debitInterest: number;

  public get totalPrice(): number {
    return calculateTotalMortgagePrice(this.currentAffordPrice, this.debitInterest);
  }

  constructor(
    private router: Router,
    private debitInterestService: DebitInterestService,
    private mapFilterStorageService: MapFilterStorageService,
  ) { }

  ngOnInit(): void {
    this.getDebitInterest();
  }

  public savePrice(): void {
    const filterData: FilterOptions = {
      PropertyType: null,
      PriceFrom: 0,
      PriceTo: this.totalPrice,
      PriceDevelopmentFrom: 0,
      PriceDevelopmentTo: this.totalPrice,
      AreaSize: null,
      AreaSize2: null,
      SellingStatus: {
        Idle: false,
        MakeMeMove: true,
        ForSale: true,
        Active: false,
      }
    };
    this.mapFilterStorageService.saveFilters(filterData);

    this.router.navigate(['/map'], {
      queryParamsHandling: 'merge',
      queryParams: {
        lat: CITIES.BERLIN.LATITUDE,
        lng: CITIES.BERLIN.LONGITUDE,
        zoom: 14
      }
    });
  }

  private async getDebitInterest(): Promise<void> {
    const { debitInterest } = await this.debitInterestService.getDebitInterest();
    this.tooltipText = `Die Berechnung der maximal möglichen Darlehenssumme beruht auf deiner Angabe zur
      monatlichen Rate, einem gebundenen Sollzins von 1,27 %, auf 10 Jahre. Basierend auf folgenden Annahmen: 200.000
      Euro Nettodarlehensbetrag, für den Kauf einer eigen genutzten Immobilie, nachhaltiger Objektwert von mindestens
      450.000 Euro, 2 % Tilgung, ohne Sondertilgung, erstrangige Absicherung des Darlehens über eine Grundschuld,
      einwandfreie Einkommens- und Vermögenssituation, gesichertes Angestelltenverhältnis, Auszahlung des Darlehens
      in einer Summe. Aktueller Zins: ${debitInterest}%`;
    this.debitInterest = debitInterest / 100;
  }
}

import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, } from 'ngx-lottie';
import { Observable, interval, Subject, timer, defer, concat } from 'rxjs';
import { tap, map, take, takeUntil, switchMap } from 'rxjs/operators';
import { DataStoreService } from 'src/app/core/services/data-store.service';

@Component({
  selector: 'app-daily-overview',
  templateUrl: './daily-overview.component.html',
  styleUrls: ['./daily-overview.component.scss'],
})


export class DailyOverviewComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  items$ = new Observable<CardItem[]>();

  WhatIsItToday = 0;

  // arry= [[616, 674], [125, 184], [195, 246], [254, 306]]
  // TimeArry:{
  //   [616, 674], [125, 184], [195, 246], [254, 306]
  // }

  // arry: [number, number][] = [[35, 36], [125, 184], [195, 246], [254, 306], [313, 365], [372, 420], [436, 490], [494, 548], [555, 611], [613, 670], [677, 734], [740, 792], [797, 850], [860, 902], [952, 922], [999, 1200]];
  arry: [number, number][] = [[35, 36], [125, 184], [125, 246], [125, 306], [125, 365], [125, 420], [125, 490], [125, 548], [125, 611], [125, 670], [125, 734], [125, 792], [125, 850], [125, 902], [125, 922], [999, 1200]];
  STFarry: [number, number][] = [ [35, 36], [245, 246], [305, 306], [364, 365], [419, 420], [489, 490], [547, 548], [610, 611], [669, 670], [733, 734], [791, 792], [849, 850], [901, 902], [921, 922], [999, 1200],[35, 36]];

  options: AnimationOptions = {
    // path: '/assets/lottie-animation.json',
    path: '/assets/MyLog14BBT.json',
  };

  TEMPimg: '/assets/imgA.png'
  private animationItem: AnimationItem;
  private isAnimationCreated: boolean = false;
  emptyCardItem = {
    hasData: false,
    day: null,
    month: null,
    date: null,
    bt: null,
    imgSrc: null,
    imgHeight: null,
  };

  constructor(
    public dataStore: DataStoreService,
    private ngZone: NgZone
  ) {
    this.items$ = this.dataStore.overviewCards$
      .pipe(
        map(cards => cards.reverse()),
      );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAnimationCreated(animationItem: AnimationItem) {
    this.animationItem = animationItem;
  }

  onDataReady() {
    this.dataStore.userData$
      .pipe(
        take(1),
        map(userData => userData.startDate),
        map(startDate => this.dateDiff((new Date(startDate)).getTime(), Date.now())),
        tap(dateDiff => this.WhatIsItToday = dateDiff),
        switchMap(dateDiff => this.startCountdown(dateDiff)),
        takeUntil(this.destroy$),
      ).subscribe(() => console.log('Animation stopped'), err => console.log(err));
  }

  private startCountdown(day: number) {
    this.animationPlay(day);
    return timer(day * 1000)
      .pipe(
        tap(() => this.animationStopOnDay(day)),
      );
  }

  private animationPlay(day: number) {
    this.ngZone.runOutsideAngular(() => this.animationItem.playSegments(this.arry[day], true));
  }

  goToLink(url: string) {
    const date = this.WhatIsItToday;
    if (date >= 14) {
      window.open(url, "_blank");
    }
  }

  private animationStopOnDay(day: number) {
    this.ngZone.runOutsideAngular(() => this.animationItem.playSegments(this.STFarry[day], true))
  }

  private dateDiff(current: number, end: number): number {
    return Math.ceil((end - current) / (1000 * 3600 * 24));
  }

}

export interface CardItem {
  hasData: boolean;
  day?: string;
  month?: string;
  date?: string;
  bt?: string;
  imgSrc?: string;
  imgHeight?: number;
}

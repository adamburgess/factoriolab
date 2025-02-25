import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { map } from 'rxjs';

import { Detail } from './data-route';

export class DetailComponent {
  id$ = this.route.params.pipe(map((params) => params['id']));
  detail$ = this.route.data.pipe(map((data) => data as Detail));
  parent$ = this.detail$.pipe(
    map(
      (detail): MenuItem => ({
        label: this.translateSvc.instant(detail.collectionLabel ?? 'none'),
        routerLink: '..',
        queryParamsHandling: 'preserve',
      })
    )
  );

  constructor(
    private route: ActivatedRoute,
    private translateSvc: TranslateService
  ) {}
}

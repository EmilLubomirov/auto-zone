import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from "@angular/material/button"
import {MatPaginatorModule} from '@angular/material/paginator';


@NgModule({
    exports: [
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatPaginatorModule
    ]
})
export class MaterialModule {}
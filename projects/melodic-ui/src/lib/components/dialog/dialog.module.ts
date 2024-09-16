import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MDDialogComponent } from './dialog.component';
import { MDDialogFooterComponent } from './components/dialog-footer/dialog-footer.component';
import { MDDialogHeaderComponent } from './components/dialog-header/dialog-header.component';
import { MDDialogHeaderDirective } from './directives/md-dialog-header.directive';
import { MDDialogFooterDirective } from './directives/md-dialog-footer.directive';
import { MDDialogService, MDDialogRef, MD_DIALOG_REF } from './dialog.service';

@NgModule({
	imports: [CommonModule, MDDialogComponent, MDDialogFooterComponent, MDDialogHeaderComponent, MDDialogFooterDirective, MDDialogHeaderDirective],
	exports: [MDDialogComponent, MDDialogFooterComponent, MDDialogHeaderComponent, MDDialogFooterDirective, MDDialogHeaderDirective]
})
export class MDDialogModule {}

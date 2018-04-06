import { Input, Component, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'canvas-tree-column',
  template: ``
})
export class CanvasTreeColumnComponent {
  @Input() text: string;

  @Input('data-index') dataindex: string;

  @Input() editable: boolean = false;

  @Input() hidden: boolean = false;

  @Input('data-type') datatype: string;

  @Input('summary-type') summarytype: string;

  @Input('summary-caption') summarycaption: string;

  @Input() width: string;

  isColumnSort: boolean;

  @ContentChild('amexioHeaderTmpl') headerTemplate: TemplateRef<any>;

  @ContentChild('amexioBodyTmpl') bodyTemplate: TemplateRef<any>;
}

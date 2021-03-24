import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[dirClosingAutocomplite]'
})
export class ClosingAutocompliteDirective implements OnInit {
  @Output() public clickOutside = new EventEmitter();

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
  }


  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
      const isClickedInside = this.elRef.nativeElement.contains(targetElement);
      if (!isClickedInside) {
          this.clickOutside.emit(null);
      }
  }
}

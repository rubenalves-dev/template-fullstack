import {
    ComponentRef,
    Directive,
    ElementRef,
    inject,
    input,
    OnDestroy,
    ViewContainerRef,
} from '@angular/core';
import { TooltipComponent } from './tooltip-component';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[tooltip]',
    host: {
        '(mouseenter)': 'show()',
        '(mouseleave)': 'hide()',
    },
})
export class Tooltip implements OnDestroy {
    private debounceTimer?: ReturnType<typeof setTimeout>;

    message = input('', { alias: 'tooltip' });

    private componentRef: ComponentRef<TooltipComponent> | null = null;
    private viewContainerRef = inject(ViewContainerRef);
    private elementRef = inject(ElementRef);

    show() {
        if (this.componentRef) return;
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.createTooltip();
        }, 500);
    }

    createTooltip() {
        if (this.componentRef) return;

        this.componentRef =
            this.viewContainerRef.createComponent(TooltipComponent);

        this.componentRef.instance.text.set(this.message());

        const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
        this.componentRef.instance.position.set({
            top: hostRect.top,
            left: hostRect.left + hostRect.width / 2,
        });
    }

    hide() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.destroy();
    }

    ngOnDestroy() {
        this.destroy();
    }

    private destroy() {
        this.componentRef?.destroy();
        this.componentRef = null;
    }
}

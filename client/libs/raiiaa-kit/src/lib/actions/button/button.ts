import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
} from '@angular/core';
import { ValuesOf } from '../../shared/utils/objects';

@Component({
  selector: 'button[r-button], a[r-button]',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'buttonClass()',
  },
})
export class Button {
  theme = input<ValuesOf<typeof ButtonTheme>>('primary');
  variant = input<ValuesOf<typeof ButtonVariant>>('solid');

  protected leftIcons = contentChildren('leftIcon', { descendants: false });
  protected rightIcons = contentChildren('rightIcon', { descendants: false });

  protected buttonClass = computed(() => {
    return `r-button r-button--${this.theme()} r-button--${this.variant()}`;
  });
}

export const ButtonTheme = {
  Primary: 'primary',
  Secondary: 'secondary',
  Black: 'black',
  White: 'white',
  Muted: 'muted',
  Destructive: 'destructive',
} as const;

export const ButtonVariant = {
  Solid: 'solid',
  Outline: 'outline',
  Ghost: 'ghost',
} as const;

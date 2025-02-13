import { Directive, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';

import { UserService, UserUpdateEvent } from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/**
 * @stable
 */
export type AuthstateAction = 'hide' | 'show' | 'disabled';

/**
 * Options for {@link AuthstateDirective}.
 *
 * @stable
 */
export interface AuthstateOptions {
    authenticated?: AuthstateAction;
    unauthenticated?: AuthstateAction;
    workflow?: AuthstateAction;
}

/**
 * @whatItDoes Shows, hides or disables an element based on user state.
 *
 * @howToUse
 *
 * ```
 * <a href="/page" *vnAuthstate="{ authenticated: 'show', unauthenticated: 'hide', workflow: 'disable' }">Link</a>
 * ```
 *
 * @description
 *
 * Same behavior as ngIf, but also with disabled option based on state of the user.
 *
 * Accepted user states:
 *  - authenticated
 *  - unauthenticated
 *  - workflow
 *
 * Accepted actions:
 *  - show
 *  - hide
 *  - disable
 *
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[vnAuthstate]',
})
export class AuthstateDirective implements OnInit, OnDestroy {
    @Input()
    set vnAuthstate(states: AuthstateOptions) {
        this.states = states;
        this.updateView();
    }

    private states: AuthstateOptions;
    private hasView: boolean = false;
    private element: HTMLElement;
    private disabled: boolean = false;
    private unsubscribe = new Subject<void>();

    constructor(
        private renderer: Renderer2,
        private template: TemplateRef<Object>,
        private user: UserService,
        private viewContainer: ViewContainerRef,
    ) {}

    ngOnInit() {
        this.user.events
            .pipe(
                filter((e) => e instanceof UserUpdateEvent),
                takeUntil(this.unsubscribe),
            )
            .subscribe(() => this.onUserstateChange());
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private toggle(show: boolean) {
        if (show && !this.hasView) {
            this.hasView = true;
            const viewRef = this.viewContainer.createEmbeddedView(this.template);
            this.element = viewRef.rootNodes[0];
        } else if (!show && this.hasView) {
            this.hasView = false;
            this.viewContainer.clear();
        }
    }

    private onUserstateChange() {
        this.updateView();
    }

    private updateView() {
        const state = this.user.workflowType > 0 ? 'workflow' : this.user.isAuthenticated ? 'authenticated' : 'unauthenticated';
        const mode: AuthstateAction = this.states ? (this.states[state] as AuthstateAction) : 'show';

        this.toggle(mode !== 'hide');

        if (mode === 'disabled') {
            this.disabled = true;
            this.renderer.addClass(this.element, 'disabled');
        } else if (this.disabled) {
            this.disabled = false;
            this.renderer.removeClass(this.element, 'disabled');
        }
    }
}

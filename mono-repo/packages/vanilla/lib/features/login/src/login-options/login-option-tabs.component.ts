import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { DsSegmentedControlModule } from '@frontend/ui/segmented-control';
import {
    FormElementTemplateForClient,
    LoginOption,
    LoginStoreService,
    MessageQueueService,
    MessageScope,
    NavigationService,
    TimerService,
    TrackingDirective,
    ViewTemplateForClient,
    trackByProp,
} from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoginTrackingService } from '../login-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TrackingDirective, DsSegmentedControlModule],
    selector: 'lh-login-option-tabs',
    templateUrl: 'login-option-tabs.component.html',
})
export class LoginOptionTabsComponent implements OnInit, OnDestroy {
    formGroup: UntypedFormGroup;
    loginTypeOptions: LoginOption[];
    readonly trackById = trackByProp<LoginOption>('id');

    @Input() loginOptions: string[];
    @Input() loginContent: ViewTemplateForClient;
    @Output() select = new EventEmitter<LoginOption>();

    private keepMessages = false;
    private destroySubject = new Subject();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private messageQueue: MessageQueueService,
        private trackingService: LoginTrackingService,
        private navigation: NavigationService,
        private loginStoreService: LoginStoreService,
        private timerService: TimerService,
    ) {}

    ngOnInit() {
        const origin = this.navigation.location.search.get('origin');

        if (origin) {
            this.loginStoreService.SelectedTab = origin;
        }

        this.loginTypeOptions = this.mapOptionsFromFormFieldWithMatchingId(this.loginOptions, this.loginContent.form);

        if (this.loginTypeOptions.length > 0 && !this.loginTypeOptions.find((o: LoginOption) => !!o.selected)) {
            this.loginTypeOptions[0]!.selected = true;
        }

        const selected = this.loginTypeOptions.length > 0 ? this.loginTypeOptions.find((o: LoginOption) => !!o.selected) : undefined;
        this.formGroup = this.formBuilder.group({ loginType: [selected] });

        if (this.loginTypeOptions.length == 1) {
            this.select.emit(selected);
        } else {
            // Wait for initial lifecycle to finish to avoid ExpressionChangedAfterItHasBeenCheckedError when changing tab
            this.timerService.setTimeout(() => this.select.emit(selected));
        }

        if (selected) {
            this.trackingService.trackTabbedLoginAction({
                actionEvent: 'Loaded',
                locationEvent: 'Login Tabbed',
                eventDetails: selected.id,
            });
        }

        this.formGroup
            .get('loginType')
            ?.valueChanges.pipe(takeUntil(this.destroySubject))
            .subscribe((event) => this.handleLoginTypeChanged(event));
    }

    ngOnDestroy() {
        this.destroySubject.next(null);
    }

    eventTracking(e: Event): any {
        return {
            'component.ActionEvent': 'Click',
            'component.CategoryEvent': 'Login Process',
            'component.LabelEvent': 'Login Screen',
            'component.LocationEvent': 'Login Tabbed',
            'component.PositionEvent': 'not applicable',
            'component.EventDetails': (e.target as any)['htmlFor'],
            'component.URLClicked': 'not applicable',
            'page.siteSection': 'Authentication',
        };
    }

    private mapOptionsFromFormFieldWithMatchingId(
        ids: string[],
        formFields: {
            [key: string]: FormElementTemplateForClient;
        },
    ) {
        if (!ids) {
            // nothing was set from outside, missing config in dynacon?
            return [];
        }
        return Object.keys(formFields)
            .filter((key) => {
                const field = formFields[key]!;
                const id = field.id!;
                return ids.indexOf(id) > -1;
            })
            .reduce(
                (result, key) => {
                    const field = formFields[key]!;
                    const values = field.values || [];
                    const selected =
                        (this.loginStoreService.SelectedTab === field.id ||
                            (values.find((e) => e.value === 'selected') || { text: '' }).text === 'true') &&
                        !result.some((x) => x.selected);

                    result.push({
                        id: field.id!,
                        label: field.label!,
                        selected: selected,
                    });

                    return result;
                },
                <{ id: string; label: string; selected: boolean }[]>[],
            );
    }
    selectOption(event: string) {
        const selectedId = this.loginTypeOptions.length > 0 ? this.loginTypeOptions.find((o: LoginOption) => !!o.id.includes(event)) : undefined;
        if (selectedId) this.handleLoginTypeChanged(selectedId);
    }

    private handleLoginTypeChanged(event: LoginOption) {
        if (this.keepMessages) {
            this.keepMessages = false;
        } else {
            this.messageQueue.clear({ clearPersistent: true, scope: MessageScope.Login });
        }

        this.messageQueue.clear({ clearPersistent: true, scope: MessageScope.LoginMessages });
        this.loginStoreService.SelectedTab = event && event.id;
        this.select.emit(event);

        if (event) {
            this.trackingService.trackTabbedLoginAction({
                actionEvent: 'Loaded',
                locationEvent: 'Login Tabbed',
                eventDetails: event.id,
            });
        }
    }
}

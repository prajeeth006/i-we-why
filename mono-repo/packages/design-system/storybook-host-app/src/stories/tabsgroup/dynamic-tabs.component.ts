import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DsButton } from '@frontend/ui/button';
import { DsTab, DsTabsGroup } from '@frontend/ui/tabsgroup';
import { BehaviorSubject, map } from 'rxjs';

@Component({
    selector: 'ds-demo-story-dynamic-tabs',
    standalone: true,
    template: `
        <button ds-button (click)="subject.next(!subject.getValue())">Toggle</button>
        <br />
        <br />
        <ds-tabs-group [(activeTab)]="activeTab">
            @if (subject | async) {
                <ds-tab [name]="'toggled'" [title]="'Show/Hide tab'">
                    <div>Will show/hide based on toggle</div>
                </ds-tab>
            }

            @for (tab of dynamicTabs | async; track tab.name) {
                <ds-tab [name]="tab.name" [title]="tab.title" [disabled]="tab.disabled">
                    <div>{{ tab.name }}</div>
                </ds-tab>
            }
        </ds-tabs-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DsTabsGroup, DsTab, DsButton, AsyncPipe],
})
export class DsDemoStoryDynamicTabsComponent {
    activeTab = 'World';

    subject = new BehaviorSubject(false);

    dynamicTabs = this.subject.pipe(
        map((disabled) => [
            {
                name: 'Hello',
                title: 'Hello',
                disabled: false,
            },
            {
                name: 'World',
                title: 'World',
                disabled: false,
            },
            {
                name: 'Dis',
                title: 'Dis',
                disabled: true,
            },
            {
                name: 'ToBeToggled',
                title: 'ToBeToggled',
                disabled,
            },
        ]),
    );
}

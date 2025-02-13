import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { InboxResourceService } from '../src/services/inbox-resource.service';
import { MessageStatus, StatusType } from '../src/services/inbox.models';

describe('InboxResourceService', () => {
    let service: InboxResourceService;
    let apiService: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiService = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InboxResourceService],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(InboxResourceService);
    });

    it('variables and methods should be initialized correctly', () => {
        expect(service.getMessages).toBeDefined();
        expect(service.getMessagesCount).toBeDefined();
        expect(service.getMessage).toBeDefined();
        expect(service.removeMessages).toBeDefined();

        expect(service.updateStatus).toBeDefined();
        expect(service.getInboxMessagesInitData).toBeDefined();
    });

    it('should call api inbox/getlist on getMessages', () => {
        service.getMessages(1, 10, StatusType.all);
        expect(apiService.get).toHaveBeenCalledWith('inbox/list', { pageIndex: 1, pageSize: 10, messageStatus: StatusType.all });
    });

    it('should call api inbox/getmessagescount on Count', () => {
        service.getMessagesCount();
        expect(apiService.get).toHaveBeenCalledWith('inbox/count');
    });

    it('should call api inbox/getsingle on getMessage', () => {
        service.getMessage('1');
        expect(apiService.get).toHaveBeenCalledWith('inbox/single', { id: '1' });
    });

    it('should call api inbox/remove on removeMessages', () => {
        service.removeMessages(['1', '2']);
        expect(apiService.post).toHaveBeenCalledWith('inbox/remove', { ids: ['1', '2'] });
    });

    it('should call api inbox/setstatus on updateStatus', () => {
        service.updateStatus(['1', '2'], MessageStatus.read);
        expect(apiService.post).toHaveBeenCalledWith(
            'inbox/setstatus',
            { ids: ['1', '2'], status: MessageStatus.read.toString() },
            { showSpinner: false },
        );
    });

    it('should call api inbox/getmessagesinitdata on InitData', () => {
        service.getInboxMessagesInitData();
        expect(apiService.get).toHaveBeenCalledWith('inbox/initdata');
    });
});

#nullable disable
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.Base;
using Frontend.Vanilla.Features.Base.Models;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Inbox.ContentProviders;
using Frontend.Vanilla.Features.Inbox.Models;
using Frontend.Vanilla.Features.TermsAndConditions;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Inbox;

internal interface IInboxMessagesClientValuesProvider : IMessagesClientValuesProvider<InboxMessageViewModel, InboxMessage, InboxMessageContent> { }

internal sealed class InboxMessagesClientValuesProvider : MessagesClientValuesProvider<InboxMessageViewModel, InboxMessage, InboxMessageContent>,
    IInboxMessagesClientValuesProvider
{
    private const string CreatedDateKey = "#INBOX_MESSAGE_CREATED_DATE#";

    private readonly Dictionary<string, IInboxContentProvider> inboxBoxContentProviders;
    private readonly ILogger log;
    private readonly IContentService contentService;
    private readonly IDateTimeCultureBasedFormatter dateTimeCultureBasedFormatter;

    public InboxMessagesClientValuesProvider(IEnumerable<IInboxContentProvider> inboxBoxContentProviders,
        IContentService contentService,
        IEnvironmentProvider environmentProvider,
        ITermsAndConditionsContentProvider termsAndConditionsContentProvider,
        ILogger<InboxMessagesClientValuesProvider> log,
        IDateTimeCultureBasedFormatter dateTimeCultureBasedFormatter)
        : base(contentService, environmentProvider, termsAndConditionsContentProvider, log)
    {
        this.inboxBoxContentProviders = inboxBoxContentProviders.ToDictionary(prov => prov.MessageSource);
        this.contentService = contentService;
        this.log = log;
        this.dateTimeCultureBasedFormatter = dateTimeCultureBasedFormatter;
    }

    public override InboxMessageViewModel GetMessage(InboxMessage inboxMessageData)
    {
        try
        {
            var inboxMessageViewModel =
                BuildMessageBasePart(inboxMessageData.Id, inboxMessageData.TemplateId, inboxMessageData.MessageType, inboxMessageData.TemplateMetaData, inboxMessageData);

            inboxMessageViewModel.CreatedDate = GetCustomKey(inboxMessageData, CreatedDateKey);
            inboxMessageViewModel.EligibleProducts = inboxMessageData.EligibleProducts?.ToList();
            inboxMessageViewModel.MessageSource = inboxMessageData.MessageSource;
            inboxMessageViewModel.MessageStatus = inboxMessageData.MessageStatus?.ToLower();
            inboxMessageViewModel.Priority = inboxMessageData.Priority;

            return inboxMessageViewModel;
        }
        catch
        {
            log.LogError("Failed to create inbox message from content with id: {id}", inboxMessageData?.TemplateId);

            return new InboxMessageViewModel { Error = $"Failed to create inbox message from content with id: {inboxMessageData?.TemplateId}." };
        }
    }

    protected override InboxMessageContent BuildMessageContent(InboxMessage inboxMessageData)
    {
        if (!string.IsNullOrEmpty(inboxMessageData?.TemplateId))
            return GetContentProvider(inboxMessageData.MessageSource).GetContent(inboxMessageData.TemplateId, inboxMessageData.TemplateMetaData);

        log.LogError("Inbox message with the {id} is missing TemplateId property", inboxMessageData?.Id);

        return null;
    }

    protected override string GetMessageSourceStatus(InboxMessage inboxMessageData, MessageResultBase<InboxMessageContent> messageResultBase) =>
        inboxMessageData.SourceStatus;

    protected override string GetCustomKey(InboxMessage inboxMessageData, string key)
        => GetContentProvider(inboxMessageData.MessageSource).ResolveMessage(inboxMessageData.TemplateMetaData.ToDictionary(k => k.Key, v => v.Value), key);

    private IInboxContentProvider GetContentProvider(string messageSource) =>
        inboxBoxContentProviders.TryGetValue(messageSource, out var search)
            ? search
            : new InboxContentProviderBase(contentService, log, dateTimeCultureBasedFormatter);

    // TODO: handle case when there is no content provider for the messageSource returned by POSAPi
    // some default should be probably used but we do not have defaul template in SiteCore should the offer to use?
    // or the message should be just excluded?
}

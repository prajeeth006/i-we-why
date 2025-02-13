#nullable disable
using System;
using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.Base;
using Frontend.Vanilla.Features.Base.Models;
using Frontend.Vanilla.Features.Games;
using Frontend.Vanilla.Features.Inbox.ContentProviders;
using Frontend.Vanilla.Features.TermsAndConditions;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.RtmsLayer;

internal interface IRtmsMessagesClientValuesProvider : IMessagesClientValuesProvider<RtmsMessageViewModel, RtmsMessageRequest, NotificationMessageContent> { }

internal sealed class RmtsMessagesClientValuesProvider(
    IContentService contentService,
    IEnvironmentProvider environmentProvider,
    ITermsAndConditionsContentProvider termsAndConditionsContentProvider,
    INotificationContentProvider contentProvider,
    IGamesMetadataService gamesMetadataService,
    IPosApiNotificationService notificationService,
    IHttpContextAccessor httpContextAccessor,
    IBonusTeaserContentProvider bonusTeaserContentProvider,
    ILogger<IRtmsMessagesClientValuesProvider> log)
    :
        MessagesClientValuesProvider<RtmsMessageViewModel, RtmsMessageRequest, NotificationMessageContent>(contentService, environmentProvider,
            termsAndConditionsContentProvider, log),
        IRtmsMessagesClientValuesProvider
{
    private const string BonusPlpKey = "BONUS_PLP";

    public override RtmsMessageViewModel GetMessage(RtmsMessageRequest messageRequest)
    {
        try
        {
            var rtmsMessageViewModel = BuildMessageBasePart(
                messageRequest.MessageId,
                messageRequest.TemplateId,
                messageRequest.MessageType,
                messageRequest.TemplateMetaData,
                messageRequest,
                messageRequest.Source);

            if (!rtmsMessageViewModel.IsAllMobileGames)
                FillGameList(rtmsMessageViewModel);

            if (!rtmsMessageViewModel.IsAllDesktopGames)
                FillDesktopGameList(rtmsMessageViewModel);

            rtmsMessageViewModel.CampaignId = messageRequest.CampaignId;
            // override offer id if empty
            rtmsMessageViewModel.OfferId = GetRtmsMessageOfferId(messageRequest, rtmsMessageViewModel);
            rtmsMessageViewModel.IsBonusTeaser = messageRequest.Source == BonusPlpKey;

            return rtmsMessageViewModel;
        }
        catch
        {
            log.LogError("Failed to create rtms message from content with id: {id}", messageRequest?.TemplateId);

            return new RtmsMessageViewModel();
        }
    }

    protected override NotificationMessageContent BuildMessageContent(RtmsMessageRequest messageRequest)
    {
        return messageRequest.Source == BonusPlpKey
            ? bonusTeaserContentProvider.GetBonusContent(messageRequest.TemplateMetaData)
            : contentProvider.GetContent(messageRequest.TemplateId, messageRequest.TemplateMetaData);
    }

    protected override string GetMessageSourceStatus(RtmsMessageRequest messageData, MessageResultBase<NotificationMessageContent> rtmsMessageViewModel)
    {
        var offerId = GetRtmsMessageOfferId(messageData, rtmsMessageViewModel);

        return string.IsNullOrEmpty(offerId) ? null : GetSourceStatus(rtmsMessageViewModel.MessageType, offerId);
    }

    protected override string GetCustomKey(RtmsMessageRequest messageData, string key)
        => contentProvider.ResolveMessage(messageData.TemplateMetaData.ToDictionary(k => k.Key, v => v.Value), key);

    private string GetRtmsMessageOfferId(RtmsMessageRequest messageData, MessageResultBase<NotificationMessageContent> rtmsMessageViewModel) =>
        string.IsNullOrEmpty(rtmsMessageViewModel.OfferId) ? messageData.CampaignId : rtmsMessageViewModel.OfferId;

    private void FillGameList(RtmsMessageViewModel rtmsMessageViewModel)
    {
        try
        {
            if (rtmsMessageViewModel.MobileGameList != null && rtmsMessageViewModel.MobileGameList.Any() && rtmsMessageViewModel.MobileAllList.Count == 0)
            {
                rtmsMessageViewModel.MobileGames =
                    gamesMetadataService.GetCasinoGames(rtmsMessageViewModel.MobileGameList.Select(x => x.InternalGameName),
                        httpContextAccessor.GetRequiredHttpContext().Request.Headers);
            }
        }
        catch (Exception e)
        {
            rtmsMessageViewModel.IsGamesLoadFailed = true; // indicate client go to lobby
            log.LogWarning(e, "Fill game list failed");
        }
    }

    private void FillDesktopGameList(RtmsMessageViewModel rtmsMessageViewModel)
    {
        try
        {
            if (rtmsMessageViewModel.DesktopGameList != null && rtmsMessageViewModel.DesktopGameList.Any() && rtmsMessageViewModel.DesktopAllList.Count == 0)
            {
                rtmsMessageViewModel.DesktopGames =
                    gamesMetadataService.GetCasinoGames(rtmsMessageViewModel.DesktopGameList.Select(x => x.InternalGameName),
                        httpContextAccessor.GetRequiredHttpContext().Request.Headers);
            }
        }
        catch (Exception e)
        {
            rtmsMessageViewModel.IsGamesLoadFailed = true; // indicate client go to lobby
            log.LogWarning(e, "Fill game list failed");
        }
    }

    private string GetSourceStatus(string messageType, string offerId)
    {
        try
        {
            switch (messageType)
            {
                case MessageConstants.Type.PROMOTARGET:
                    return notificationService.GetOfferStatus("promos", offerId);
                case MessageConstants.Type.EDSOFFER:
                    return notificationService.GetOfferStatus("eds", offerId);
            }

            return null;
        }
        catch (Exception e)
        {
            log.LogWarning(e, "GetSourceStatus failed with {messageType} and {offerId}", messageType, offerId);

            return null;
        }
    }
}

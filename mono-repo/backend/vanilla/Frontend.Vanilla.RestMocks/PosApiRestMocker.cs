#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account.SofStatus;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ArcPlayBreaks;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.RestMocks;

internal partial class RestMocker
{
    /// <summary>
    /// Gets mocks with common PosAPI responses.
    /// </summary>
    public IEnumerable<RestMock> GetCommonPosApiMocks()
    {
        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/AnonymousClaims"),
            ResponseFromThisAssembly("Authentication.svc_AnonymousClaims.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/LastSession"),
            ResponseFromThisAssembly("Authentication.svc_LastSession.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/OTP/VerificationStatus"),
            ResponseFromThisAssembly("Authentication.svc_OTP_VerificationStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/Logout", HttpMethod.Post),
            ResponseFromThisAssembly("Authentication.svc_Logout.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/AutoLogin", HttpMethod.Post),
            ResponseFromThisAssembly("Authentication.svc_Login.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/SkipWorkflow", HttpMethod.Post),
            ResponseFromThisAssembly("Authentication.svc_Login.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/FinalizeWorkflow", HttpMethod.Post),
            ResponseFromThisAssembly("Authentication.svc_Login.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/Balance"),
            DynamicResponse((c) =>
            {
                var responseData = ReadAssemblyFile(GetType().Assembly, "Wallet.svc_Balance.json");

                var balanceResponse = JsonDeserialize<BalancePosApiDto>(responseData);

                if (c.RestRequest.Headers.GetValue("x-bwin-session-token") == "SessionToken_LowBalanceUser")
                    balanceResponse.AccountBalance = 3;

                return JsonSerialize(balanceResponse);
            }));

        yield return new RestMock(
            IncomingRequestsToThisApp("/api/balance"),
            OutgoingRequestsToPosApi("Wallet.svc/Balance"),
            DynamicResponse((c) =>
            {
                var responseData = ReadAssemblyFile(GetType().Assembly, "Wallet.svc_Balance_refresh.json");

                var balanceResponse = JsonDeserialize<BalancePosApiDto>(responseData);

                foreach (var propertyInfo in balanceResponse.GetType().GetProperties())
                {
                    if (propertyInfo.PropertyType != typeof(decimal)) continue;

                    var input = c.BrowserRequest?.Query[propertyInfo.Name];

                    if (!string.IsNullOrEmpty(input))
                    {
                        propertyInfo.SetValue(balanceResponse, Convert.ToDecimal(input));
                    }
                }

                return JsonSerialize(balanceResponse);
            }));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/TourneyTokenBalance"),
            ResponseFromThisAssembly("Wallet.svc_TourneyTokenBalance.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/Balance/Transfer", HttpMethod.Post),
            ResponseFromThisAssembly("Wallet.svc_BalanceTransfer.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/LoyaltyProfile"),
            ResponseFromThisAssembly("CRM.svc_LoyaltyProfile.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/LoyaltyProfile/Basic"),
            ResponseFromThisAssembly("CRM.svc_LoyaltyProfileBasic.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/Loyalty/ValueSegment"),
            ResponseFromThisAssembly("CRM.svc_ValueSegment.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/Bonuses"),
            ResponseFromThisAssembly("CRM.svc_Bonuses.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/BonusOffers"),
            ResponseFromThisAssembly("CRM.svc_BonusOffers.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/CampaignData"),
            ResponseFromThisAssembly("CRM.svc_CampaignData.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/Player/Scrub", HttpMethod.Post),
            ResponseFromThisAssembly("CRM.svc_PlayerScrub.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/BonusBalance"),
            ResponseFromThisAssembly("CRM.svc_BonusBalance.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/BonusBalance/ThirdParty"),
            ResponseFromThisAssembly("CRM.svc_ThirdPartyBonusBalance.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/MappedTrackerId"),
            ResponseFromThisAssembly("CRM.svc_MappedTrackerId.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/Personalized/Player/Attributes"),
            ResponseFromThisAssembly("CRM.svc_Personalized_Player_Attributes.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            c =>
            {
                if (c.RestRequest.Url.PathAndQuery.Contains("CRM.svc/WmIdForBTag") != true)
                    return false;

                var qs = HttpUtility.ParseQueryString(c.RestRequest.Url.Query);
                var btag = qs["btag"];
                var affid = qs["affid"];

                if (btag == null && affid == null)
                    return false;

                var wmid = qs["wmid"] ?? qs["wm"];

                return btag == "abc" || affid == "112233" || wmid == "xyz";
            },
            ResponseFromThisAssembly("CRM.svc_WmIdForBTag.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/Refresh"),
            StaticResponse(""));

        // DeviceAtlas is being refreshed from any page in the meantime
        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Content.svc/DeviceRecognition/DeviceAtlas3"),
            ResponseFromThisAssembly("Content.svc_DeviceRecognition_DeviceAtlas.txt"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/BonusFlowContent"),
            ResponseFromThisAssembly("CRM.svc_BonusFlowContent.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            c =>
            {
                if (c.RestRequest.Url.PathAndQuery.Contains(
                        "CRM.svc/BonusFlowContent?trackerId=1234&stage=LANDING&language=en-US") != true)
                    return false;

                var qs = HttpUtility.ParseQueryString(c.RestRequest.Url.Query);
                var trackerId = qs["trackerId"];

                if (trackerId == null)
                    return false;

                return trackerId == "1234";
            },
            ResponseFromThisAssembly("CRM.svc_BonusFlowContent_NoContent.json", HttpStatusCode.BadRequest));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/UpdateBonusTncAcceptance", HttpMethod.Post),
            ResponseFromThisAssembly("CRM.svc_UpdateBonusTncAcceptance.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/BonusFlowContent?trackerid=123&stage=LANDING&language=en-US"),
            ResponseFromThisAssembly("Error.json", HttpStatusCode.NotFound));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/PokerWeekly/Points/Weekly"),
            ResponseFromThisAssembly("CRM.svc_Poker_Points_Week.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/ReferredFriends"),
            ResponseFromThisAssembly("CRM.svc_ReferredFriends.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/LoyaltyProfile/Mlife"),
            ResponseFromThisAssembly("CRM.svc_Loyalty_Profile_Mlife.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/TrackerUrl"),
            ResponseFromThisAssembly("CRM.svc_TrackerUrl.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/ContactCapabilities"),
            ResponseFromThisAssembly("CRM.svc_ContactCapabilities.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/ContactAvailabilities"),
            ResponseFromThisAssembly("CRM.svc_ContactAvailabilities.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/PlayerGamingDeclaration"),
            ResponseFromThisAssembly("CRM.svc_PlayerGamingDeclaration.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/PlayerGamingDeclaration", HttpMethod.Post),
            StaticResponse(string.Empty));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/Gamification/Coins/Balance", HttpMethod.Post),
            ResponseFromThisAssembly("CRM.svc_GamificationCoinBalance.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/InvitationUrl"),
            ResponseFromThisAssembly("CRM.svc_InvitationUrl.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Common.svc/AllCountries"),
            ResponseFromThisAssembly("Common.svc_AllCountries.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Common.svc/Currency"),
            ResponseFromThisAssembly("Common.svc_Currency.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Common.svc/Inventory/Shop/V2/1"),
            ResponseFromThisAssembly("Common.svc_Inventory_Shop_V2.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Common.svc/Inventory/Terminal/1/1"),
            ResponseFromThisAssembly("Common.svc_Inventory_Terminal.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Common.svc/ClientInformation"),
            ResponseFromThisAssembly("Common.svc_ClientInformation.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/offers/eds/123/status"),
            ResponseFromThisAssembly("Notification.svc_GetOfferStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/offers/bonuses/123/status"),
            ResponseFromThisAssembly("Notification.svc_GetOfferStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/offers/bonuses/4065426/status"),
            ResponseFromThisAssembly("Notification.svc_GetOfferStatus_4065426.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/offers/promos/123/status"),
            ResponseFromThisAssembly("Notification.svc_GetOfferStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/inbox/count"),
            ResponseFromThisAssembly("Notification.svc_GetInboxMessageCount.json"));

        yield return new RestMock(
            IncomingRequestsToThisApp("/api/offers/eds/123"),
            OutgoingRequestsToPosApi("Notification.svc/offers/eds/123/status", HttpMethod.Post),
            ResponseFromThisAssembly("Notification.svc_UpdateOfferStatus.json"));

        yield return new RestMock(
            IncomingRequestsToThisApp("/health"),
            OutgoingRequestsToPosApi("Common.svc/Language"),
            ResponseFromThisAssembly("Common.svc_Language.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Common.svc/List"),
            ResponseFromThisAssembly("Error.json", HttpStatusCode.InternalServerError));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Common.svc/List/testList"),
            ResponseFromThisAssembly("Common.svc_List_testList.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Common.svc/NativeApps/"),
            ResponseFromThisAssembly("Common.svc_ApplicationInformation.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Kyc.svc/KycStatus"),
            DynamicResponse((c) => ReadAssemblyFile(GetType().Assembly,
                c.GetCookie("kyc_verified") == "1"
                    ? "Kyc.svc_KycStatus_Verified.json"
                    : "Kyc.svc_KycStatus.json")));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Kyc.svc/KycInfoForRibbon"),
            ResponseFromThisAssembly("Kyc.svc_KycInfoForRibbon.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Kyc.svc/Document/VerificationOptions"),
            DynamicResponse(c => MockedResponse(c, endpoint: "Kyc.svc_Document_VerificationOptions")));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/RegistrationDate"),
            ResponseFromThisAssembly("Account.svc_RegistrationDate.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/GetDnaAbuserInformation"),
            ResponseFromThisAssembly("Account.svc_GetDnaAbuserInformation.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/De/UnregisteredBrandsV2"),
            ResponseFromThisAssembly("Account.svc_DE_UnregisteredBrandsV2.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/SofStatusDetails"),
            DynamicResponse((_) =>
            {
                var sofStatusDetailsDto =
                    new SofStatusDetailsDto("red", new UtcDateTime(DateTime.UtcNow.AddDays(-2)));

                return JsonSerialize(sofStatusDetailsDto);
            }));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/UserSegmentationGroups"),
            ResponseFromThisAssembly("Account.svc_UserSegmentationGroups.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/MOHDetails"),
            ResponseFromThisAssembly("Account.svc_MohDetails.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/AssociatedAccounts"),
            ResponseFromThisAssembly("Account.svc_AssociatedAccounts.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/DropBonusOffer", HttpMethod.Post),
            ResponseFromThisAssembly("CRM.svc_UpdateBonusTncAcceptance.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/player/flags"),
            ResponseFromThisAssembly("CRM.svc_playerflags.json"));

        var currentSessionStartTime = (DateTime?)null;

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/CurrentSession"),
            DynamicResponse(
                req =>
                {
                    if (!currentSessionStartTime.HasValue ||
                        currentSessionStartTime.Value.Subtract(DateTime.UtcNow).TotalHours > 24 ||
                        (req.HttpContext?.User.Claims.Any(c =>
                            c.Type == PosApiClaimTypes.AccBusinessPhase && c.Value == "anonymous") ?? false))
                    {
                        currentSessionStartTime = DateTime.UtcNow;
                    }

                    var response = new JObject
                    {
                        ["isAutomaticLogoutRequired"] = false,
                        ["startTimeUTC"] = currentSessionStartTime,
                        ["expirationTimeUTC"] = currentSessionStartTime.Value.AddHours(24),
                    };

                    return JsonConvert.SerializeObject(
                        response,
                        new JsonSerializerSettings
                        {
                            DateFormatHandling = DateFormatHandling.MicrosoftDateFormat,
                        });
                }));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            c => c.RestRequest.Url.Host == "service.prerender.io",
            DynamicResponse(
                c =>
                {
                    var urlToPrerender = WebUtility.HtmlEncode(c.RestRequest.Url.PathAndQuery.Substring(1));
                    var prerenderToken = WebUtility.HtmlEncode(c.RestRequest.Headers["X-Prerender-Token"]);

                    return $@"Mocked pre-rendered HTML for {urlToPrerender} with token '{prerenderToken}'.";
                }));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/CommunicationSettings"),
            ResponseFromThisAssembly("Account.svc_CommunicationSettings.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            c =>
            {
                try
                {
                    var disabled = c.GetCookie("DisableSitecore")?.ToLower() == "true";

                    return disabled && c.RestRequest.Url.Host.Contains("cms.prod.env.works");
                }
                catch (Exception)
                {
                    return false;
                }
            },
            StaticResponse("Error", HttpStatusCode.InternalServerError));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            c =>
            {
                try
                {
                    var reCaptchaResponseMocked = !string.IsNullOrEmpty(c.GetCookie("MockReCaptchaResponse"));

                    return reCaptchaResponseMocked &&
                           c.RestRequest.Url.AbsoluteUri.StartsWith(
                               "https://www.google.com/recaptcha/api/siteverify");
                }
                catch (Exception)
                {
                    return false;
                }
            },
            DynamicResponse(c => WebUtility.UrlDecode(c.GetCookie("MockReCaptchaResponse"))));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/QuickDeposit"),
            ResponseFromThisAssembly("Wallet.svc_QuickDeposit.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/Curfew/GetCurfewStatus"),
            ResponseFromThisAssembly("Wallet.svc_Curfew_GetCurfewStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/netLossInfo?level=user_level&days=7"),
            ResponseFromThisAssembly("Wallet.svc_NetLossInfo.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/netLossInfoV2"),
            ResponseFromThisAssembly("Wallet.svc_NetLossInfoV2.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/AverageDepositValues"),
            ResponseFromThisAssembly("Wallet.svc_AverageDepositValues.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/ProfitLossSummary"),
            ResponseFromThisAssembly("Wallet.svc_ProfitLossSummary.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Journaling.svc/Messages"),
            ResponseFromThisAssembly("Journaling.svc_Messages.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Journaling.svc/Messages", HttpMethod.Post),
            ResponseFromThisAssembly("Journaling.svc_Messages_Post.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/BankAccountInfo"),
            ResponseFromThisAssembly("Wallet.svc_BankAccountInfo.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Upload.svc/CustomerDocDetails"),
            DynamicResponse(c => MockedResponse(c, endpoint: "Upload.svc_CustomerDocDetails")));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Upload.svc/DocumentUploadStatus"),
            ResponseFromThisAssembly("Upload.svc_DocumentUploadStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/CashierStatus"),
            ResponseFromThisAssembly("Account.svc_CashierStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/ProductLicenseInfos"),
            ResponseFromThisAssembly("Account.svc_ProductLicenseInfos.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/EmailVerificationStatus"),
            ResponseFromThisAssembly("Account.svc_EmailVerificationStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("CRM.svc/Loyalty/Cashback"),
            ResponseFromThisAssembly("CRM.svc_LoyaltyCashback.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/TransactionHistory"),
            ResponseFromThisAssembly("Wallet.svc_TransactionHistory.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/PlayerActivitySummary"),
            ResponseFromThisAssembly("Wallet.svc_PlayerActivitySummary.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/UserTransactionSummary"),
            ResponseFromThisAssembly("Wallet.svc_UserTransactionSummary.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/SessionFundSummary"),
            ResponseFromThisAssembly("Wallet.svc_SessionFundSummary.json"));

        yield return new RestMock(
            IncomingRequestsToThisApp("/api/offers/count"),
            OutgoingRequestsToPosApi("Promohub.svc/Offers/count"),
            ResponseFromThisAssembly("Promohub.svc_Offers_count.json"));

        yield return new RestMock(
            IncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Promohub.svc/details/bonus/12/award"),
            ResponseFromThisAssembly("Promohub.svc_Bonus_award.json"));

        yield return new RestMock(
            IncomingRequestsToThisApp("/api/offers/postloginpopupscount"),
            OutgoingRequestsToPosApi("Authentication.svc/PostLoginPopups"),
            ResponseFromThisAssembly("Authentication.svc_PostLoginPopups.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/inbox/status", HttpMethod.Post),
            ResponseFromThisAssembly("Notification.svc_SetStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/inbox?status=NEW"),
            ResponseFromThisAssembly("Notification.svc_GetNewInboxMessages.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/inbox?status=ALL"),
            ResponseFromThisAssembly("Notification.svc_GetAllInboxMessages.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/offers/bonuses/123/status", HttpMethod.Post),
            ResponseFromThisAssembly("Notification.svc_UpdateBonusOfferStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/offers/promos/123/status", HttpMethod.Post),
            ResponseFromThisAssembly("Notification.svc_UpdateOfferStatus.json"));

        yield return new RestMock(
            IncomingRequestsToThisApp("/api/inbox/casinomobilegamesmetadata"),
            c => c.RestRequest.Url.AbsolutePath.Contains("casino"),
            ResponseFromThisAssembly("Casino_GetGamesMetadata.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Account.svc/Password/ValidationRequired"),
            ResponseFromThisAssembly("Account.svc_Password_ValidationRequired.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/RealityCheck/RcpuContinue", HttpMethod.Post),
            ResponseFromThisAssembly("ResponsibleGaming.svc_RealityCheck_RcpuContinue.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/RealityCheck/RcpuQuit", HttpMethod.Post),
            ResponseFromThisAssembly("ResponsibleGaming.svc_RealityCheck_RcpuQuit.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/RealityCheck/RcpuStatus"),
            ResponseFromThisAssembly("ResponsibleGaming.svc_RealityCheck_RcpuStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/Arc/PlayBreakStatus"),
            ResponseFromThisAssembly("ResponsibleGaming.svc_ArcPlayBreakStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/Arc/AcknowledgePlayBreakAction", HttpMethod.Post),
            DynamicResponse(c =>
            {
                var request = c.RestRequest.Content?.Value as ArcPlayBreakActionRequest;

                if (request?.AfterXMinutes is null || request?.PlayBreakDuration is null)
                {
                    throw new PosApiException(
                        "Exception",
                        httpCode: HttpStatusCode.BadRequest,
                        posApiCode: 102,
                        posApiMessage: "An error occurred",
                        posApiValues: new Dictionary<string, string?>
                        {
                            { "ErrorCode", "102" },
                            { "ErrorMessage", "Invalid input" },
                        });
                }

                return "{\"code\": 200,\n  \"message\": \"\"}";
            }));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Retail.svc/TerminalSession"),
            ResponseFromThisAssembly("Retail.svc_TerminalSession.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            c => c.RestRequest.Url.PathAndQuery.Contains("ValueTicket"),
            ResponseFromThisAssembly("Retail.svc_ValueTicket_PRINTED.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Retail.svc/PayoutValueTicket", HttpMethod.Post),
            DynamicResponse(c => MockedResponse(c, endpoint: "Retail.svc_PayoutValueTicket")));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/Limits/Player"),
            ResponseFromThisAssembly("ResponsibleGaming.svc_Limits_Player.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/selfExclusionDetails"),
            ResponseFromThisAssembly("ResponsibleGaming.svc_SelfExclusionDetails.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/Affordability/Snapshot"),
            ResponseFromThisAssembly("ResponsibleGaming.svc_Affordability_Snapshot.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/Affordability/SnapshotDetailsV2", HttpMethod.Post),
            ResponseFromThisAssembly("ResponsibleGaming.svc_Affordability_SnapshotDetailsV2.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/Limits/Deposit/v2"),
            ResponseFromThisAssembly("ResponsibleGaming.svc_Limits_Deposit.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/ValidateTokens"),
            StaticResponse(string.Empty));

        yield return new RestMock(
            c => c.GetCookie("FailPosApiTokens")?.ToLower() == "true",
            OutgoingRequestsToPosApi("Authentication.svc/ValidateTokens"),
            ResponseFromThisAssembly("Authentication.svc_ValidateTokens_Error.json", HttpStatusCode.BadRequest));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("GeoLocation.svc/mappedLocation"),
            ResponseFromThisAssembly("GeoLocation.svc_mappedLocation.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Content.svc/betting/Sport/14"),
            ResponseFromThisAssembly("Content.svc_BettingTranslations.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Content.svc/betting/League/14"),
            ResponseFromThisAssembly("Content.svc_BettingTranslations.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Content.svc/betting/Fixture/14"),
            ResponseFromThisAssembly("Content.svc_BettingTranslations.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/CustomerNetDeposit?timeSlot=MONTHLY"),
            ResponseFromThisAssembly("Wallet.svc_CustomerNetDeposit.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/CustomerNetDeposit?timeSlot=YEARLY"),
            ResponseFromThisAssembly("Wallet.svc_CustomerNetDeposit.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/Arc/SaveScreenTime", HttpMethod.Post),
            ResponseFromThisAssembly("ResponsibleGaming.svc_Arc_SaveScreenTime.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/Arc/SessionSummary"),
            ResponseFromThisAssembly("Authentication.svc_Arc_SessionSummary.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/eds/group/optin", HttpMethod.Post),
            ResponseFromThisAssembly("Notification.svc_UpdateEdsGroupOfferStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Notification.svc/eds/group/3245/optin/status"),
            ResponseFromThisAssembly("Notification.svc_GetEdsGroupOfferStatus.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("ResponsibleGaming.svc/PlayerArea", HttpMethod.Post),
            ResponseFromThisAssembly("ResponsibleGaming.svc_PlayerArea.json"));
        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Wallet.svc/activeWagerDetails"),
            ResponseFromThisAssembly("Wallet.svc_ActiveWagerDetails.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("Authentication.svc/saveSessionLimitsPopupAction", HttpMethod.Post),
            ResponseFromThisAssembly("Authentication.svc_SaveSessionLimitsPopupAction.json"));

        yield return new RestMock(
            AllIncomingRequestsToThisApp(),
            OutgoingRequestsToPosApi("myBets/v1/customer-has-bets"),
            ResponseFromThisAssembly("MyBets_CustomerHasBets.json"));
    }

    private string MockedResponse(RestMockDelegateContext context, string endpoint, int? posApiCode = null)
    {
        var query = context.RestRequest.Url.Host.ToLower().Contains("posapi")
            ? string.Empty
            : HttpUtility.ParseQueryString(context.RestRequest.Url.Query).GetValues(0)?.FirstOrDefault() ??
              string.Empty;

        if (posApiCode.HasValue || query.Contains("EXCEPTION"))
        {
            var errorCode = query.Replace("_EXCEPTION", string.Empty);

            throw new PosApiException(
                "Exception",
                httpCode: HttpStatusCode.BadRequest,
                posApiCode: posApiCode ?? 102,
                posApiMessage: "An error occurred",
                posApiValues: new Dictionary<string, string?>
                {
                    { "ErrorCode", errorCode },
                    { "ErrorMessage", context.RestRequest.Url.AbsoluteUri },
                });
        }

        if (context.RestRequest.Url.AbsolutePath.Contains("ValueTicket", StringComparison.OrdinalIgnoreCase))
        {
            var path = context.RestRequest.Url.AbsolutePath.Split('/');
            var status = string.Empty;

            if (path.Length > 1)
            {
                status = path[path.Length - 1];
            }

            var file = string.IsNullOrWhiteSpace(status) ? $"{endpoint}.json" : $"{endpoint}_{status}.json";

            return ReadAssemblyFile(GetType().Assembly, file);
        }

        var fileName = string.IsNullOrWhiteSpace(query) ? $"{endpoint}.json" : $"{endpoint}_{query}.json";

        return ReadAssemblyFile(GetType().Assembly, fileName);
    }
}

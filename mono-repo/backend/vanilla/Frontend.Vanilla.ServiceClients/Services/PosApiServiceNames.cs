using System;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Services;

internal static class PosApiServiceNames
{
    public const string Account = "Account.svc";
    public const string Authentication = "Authentication.svc";
    public const string CommonData = "Common.svc";
    public const string Crm = "CRM.svc";
    public const string Notification = "Notification.svc";
    public const string ResponsibleGaming = "ResponsibleGaming.svc";
    public const string Retail = "Retail.svc";
    public const string Wallet = "Wallet.svc";
    public const string Content = "Content.svc";
    public const string GeoLocation = "GeoLocation.svc";
    public const string Registration = "Registration.svc";
    public const string Kyc = "Kyc.svc";
    public const string PromoHub = "Promohub.svc";
    public const string Upload = "Upload.svc";
}

internal static class PosApiEndpoint
{
    internal static class Account
    {
        public static PathRelativeUri AssociatedAccounts { get; } = GetRelativeUri(PosApiServiceNames.Account, "AssociatedAccounts");
        public static PathRelativeUri CashierStatus { get; } = GetRelativeUri(PosApiServiceNames.Account, "CashierStatus");
        public static PathRelativeUri CommunicationSettings { get; } = GetRelativeUri(PosApiServiceNames.Account, "CommunicationSettings");
        public static PathRelativeUri DeUnregisteredBrandsV2 { get; } = GetRelativeUri(PosApiServiceNames.Account, "De", "UnregisteredBrandsV2");
        public static PathRelativeUri GetDnaAbuserInformation { get; } = GetRelativeUri(PosApiServiceNames.Account, "GetDnaAbuserInformation");
        public static PathRelativeUri MohDetails { get; } = GetRelativeUri(PosApiServiceNames.Account, "MOHDetails");
        public static PathRelativeUri PasswordValidationRequired { get; } = GetRelativeUri(PosApiServiceNames.Account, "Password", "ValidationRequired");
        public static PathRelativeUri ProductLicenseInfos { get; } = GetRelativeUri(PosApiServiceNames.Account, "ProductLicenseInfos");
        public static PathRelativeUri RegistrationDate { get; } = GetRelativeUri(PosApiServiceNames.Account, "RegistrationDate");
        public static PathRelativeUri SofStatusDetails { get; } = GetRelativeUri(PosApiServiceNames.Account, "SofStatusDetails");
        public static PathRelativeUri UserSegmentationGroups { get; } = GetRelativeUri(PosApiServiceNames.Account, "UserSegmentationGroups");
        public static PathRelativeUri ValidateEmailVerificationCode { get; } = GetRelativeUri(PosApiServiceNames.Account, "ValidateEmailVerificationCode");
    }

    internal static class Authentication
    {
        public static PathRelativeUri CancelWorkflow { get; } = GetRelativeUri(PosApiServiceNames.Authentication, "CancelWorkflow");
        public static PathRelativeUri CurrentSession { get; } = GetRelativeUri(PosApiServiceNames.Authentication, "CurrentSession");
        public static PathRelativeUri LastSession { get; } = GetRelativeUri(PosApiServiceNames.Authentication, "LastSession");
        public static PathRelativeUri Logout { get; } = GetRelativeUri(PosApiServiceNames.Authentication, "Logout");
        public static PathRelativeUri OtpVerificationStatus { get; } = GetRelativeUri(PosApiServiceNames.Authentication, "OTP", "VerificationStatus");
        public static PathRelativeUri PendingActions { get; } = GetRelativeUri(PosApiServiceNames.Authentication, "PendingActions");
        public static PathRelativeUri Refresh { get; } = GetRelativeUri(PosApiServiceNames.Authentication, "Refresh");
        public static PathRelativeUri SaveSessionLimitsPopupAction { get; } = GetRelativeUri(PosApiServiceNames.Authentication, "SaveSessionLimitsPopupAction");
        public static PathRelativeUri ValidateTokens { get; } = GetRelativeUri(PosApiServiceNames.Authentication, "ValidateTokens");
        public static PathRelativeUri WorkflowData { get; } = GetRelativeUri(PosApiServiceNames.Authentication, "WorkflowData");
    }

    internal static class CommonData
    {
        public static PathRelativeUri ClientInformation { get; } = GetRelativeUri(PosApiServiceNames.CommonData, "ClientInformation");
    }

    internal static class Crm
    {
        public static PathRelativeUri BasicLoyaltyProfile { get; } = GetRelativeUri(PosApiServiceNames.Crm, "LoyaltyProfile", "Basic");
        public static PathRelativeUri BonusBalance { get; } = GetRelativeUri(PosApiServiceNames.Crm, "BonusBalance");
        public static PathRelativeUri BonusOffers { get; } = GetRelativeUri(PosApiServiceNames.Crm, "BonusOffers");
        public static PathRelativeUri CampaignData { get; } = GetRelativeUri(PosApiServiceNames.Crm, "CampaignData");
        public static PathRelativeUri DropBonusOffer { get; } = GetRelativeUri(PosApiServiceNames.Crm, "DropBonusOffer");
        public static PathRelativeUri GamificationCoinsBalance { get; } = GetRelativeUri(PosApiServiceNames.Crm, "Gamification", "Coins", "Balance");
        public static PathRelativeUri InvitationUrl { get; } = GetRelativeUri(PosApiServiceNames.Crm, "InvitationUrl");
        public static PathRelativeUri LoyaltyCashback { get; } = GetRelativeUri(PosApiServiceNames.Crm, "Loyalty", "Cashback");
        public static PathRelativeUri LoyaltyCashbackV2 { get; } = GetRelativeUri(PosApiServiceNames.Crm, "Loyalty", "Cashback", "v2");
        public static PathRelativeUri LoyaltyProfile { get; } = GetRelativeUri(PosApiServiceNames.Crm, "LoyaltyProfile");
        public static PathRelativeUri LoyaltyProfileMlife { get; } = GetRelativeUri(PosApiServiceNames.Crm, "LoyaltyProfile", "Mlife");
        public static PathRelativeUri LoyaltyValueSegment { get; } = GetRelativeUri(PosApiServiceNames.Crm, "Loyalty", "ValueSegment");
        public static PathRelativeUri PersonalizedPlayerAttributes { get; } = GetRelativeUri(PosApiServiceNames.Crm, "Personalized", "Player", "Attributes");
        public static PathRelativeUri PlayerFlags { get; } = GetRelativeUri(PosApiServiceNames.Crm, "Player", "Flags");
        public static PathRelativeUri PlayerGamingDeclaration { get; } = GetRelativeUri(PosApiServiceNames.Crm, "PlayerGamingDeclaration");
        public static PathRelativeUri PlayerScrub { get; } = GetRelativeUri(PosApiServiceNames.Crm, "Player", "Scrub");
        public static PathRelativeUri PokerWeeklyPoints { get; } = GetRelativeUri(PosApiServiceNames.Crm, "PokerWeekly", "Points", "Weekly");
        public static PathRelativeUri ReferredFriends { get; } = GetRelativeUri(PosApiServiceNames.Crm, "ReferredFriends");
        public static PathRelativeUri UpdateBonusTncAcceptance { get; } = GetRelativeUri(PosApiServiceNames.Crm, "UpdateBonusTncAcceptance");
        public static PathRelativeUri WeekPoints { get; } = GetRelativeUri(PosApiServiceNames.Crm, "Points", "Week");
    }

    internal static class Kyc
    {
        public static PathRelativeUri KycInfoForRibbon { get; } = GetRelativeUri(PosApiServiceNames.Kyc, "KycInfoForRibbon");
        public static PathRelativeUri KycStatus { get; } = GetRelativeUri(PosApiServiceNames.Kyc, "KycStatus");
    }

    internal static class Notification
    {
        public static PathRelativeUri EdsGroupOptIn { get; } = GetRelativeUri(PosApiServiceNames.Notification, "Eds", "Group", "OptIn");
        public static PathRelativeUri InboxStatus { get; } = GetRelativeUri(PosApiServiceNames.Notification, "Inbox", "Status");
    }

    internal static class Retail
    {
        public static PathRelativeUri TerminalSession { get; } = GetRelativeUri(PosApiServiceNames.Retail, "TerminalSession");

        public static PathRelativeUri PayoutValueTicket(string id)
            => GetRelativeUri(PosApiServiceNames.Retail, "PayoutValueTicket", id);
    }

    internal static class ResponsibleGaming
    {
        public static PathRelativeUri AffordabilitySnapshotDetailsV2 { get; } =
            GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "Affordability", "SnapshotDetailsV2");

        public static PathRelativeUri ArcAcknowledgePlayBreakAction { get; } = GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "Arc", "AcknowledgePlayBreakAction");
        public static PathRelativeUri ArcPlayBreakStatus { get; } = GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "Arc", "PlayBreakStatus");
        public static PathRelativeUri ArcSaveScreenTime { get; } = GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "Arc", "SaveScreenTime");
        public static PathRelativeUri LimitsDepositV2 { get; } = GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "Limits", "Deposit", "v2");
        public static PathRelativeUri LimitsPlayer { get; } = GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "Limits", "Player");
        public static PathRelativeUri PlayerArea { get; } = GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "PlayerArea");
        public static PathRelativeUri RealityCheckRcpuContinue { get; } = GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "RealityCheck", "RcpuContinue");
        public static PathRelativeUri RealityCheckRcpuQuit { get; } = GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "RealityCheck", "RcpuQuit");
        public static PathRelativeUri RealityCheckRcpuStatus { get; } = GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "RealityCheck", "RcpuStatus");
        public static PathRelativeUri SelfExclusionDetails { get; } = GetRelativeUri(PosApiServiceNames.ResponsibleGaming, "SelfExclusionDetails");
    }

    internal static class Wallet
    {
        public static PathRelativeUri ActiveWagerDetails { get; } = GetRelativeUri(PosApiServiceNames.Wallet, "ActiveWagerDetails");
        public static PathRelativeUri BalanceTransfer { get; } = GetRelativeUri(PosApiServiceNames.Wallet, "Balance", "Transfer");
        public static PathRelativeUri TourneyTokenBalance { get; } = GetRelativeUri(PosApiServiceNames.Wallet, "TourneyTokenBalance");
    }

    private static PathRelativeUri GetRelativeUri(params string[] pathSegments)
    {
        var uriBuilder = new UriBuilder();

        foreach (var segment in pathSegments)
        {
            uriBuilder.AppendPathSegment(segment);
        }

        return uriBuilder.GetRelativeUri();
    }
}

namespace Frontend.Vanilla.Features.RtmsLayer;

internal sealed class MessageConstants
{
    internal sealed class SourceStatus
    {
        public const string OFFERNEW = "OFFER_NEW";
        public const string OFFERTNCACCEPTED = "OFFER_TNC_ACCEPTED";
        public const string OFFERCLAIMED = "OFFER_CLAIMED";
        public const string OFFERDROPPED = "OFFER_DROPPED";
        public const string OFFEREXPIRED = "OFFER_EXPIRED";
        public const string OFFERED = "OFFERED";
        public const string NOTOFFERED = "NOTOFFERED";
        public const string EXPIRED = "EXPIRED";
        public const string OPTEDIN = "OPTEDIN";
        public const string OPTEDOUT = "OPTEDOUT";
        public const string INVALID = "INVALID";
        public const string NOOFFER = "NO_OFFER";
    }

    internal sealed class Type
    {
        public const string EDSOFFER = "EDS_OFFER";
        public const string EDSREWARD = "EDS_REWARD";
        public const string PROMOTARGET = "PROMO_TARGET";
        public const string PROMOREWARD = "PROMO_REWARD";
        public const string CMSOFFER = "CMS_OFFER";
        public const string BONUSOFFER = "BONUS_OFFER";
    }
}

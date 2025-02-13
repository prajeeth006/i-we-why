namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryCache
    {
        int AbsoluteExpiration { get; }
        int SlidingExpiration { get; }

        int RuleItemAbsoluteExpiration { get; }
        int RuleItemSlidingExpiration { get; }
        int PresenceMessageAbsoluteExpiration { get; }
        int PresenceMessageSlidingExpiration { get; }
        bool IsScreensCacheEnabled { get; }
    }
    public class GantryCache : IGantryCache
    {
        public int AbsoluteExpiration { get; set; }
        public int SlidingExpiration { get; set; }

        public int RuleItemAbsoluteExpiration { get; set; }
        public int RuleItemSlidingExpiration { get; set; }
        public int PresenceMessageAbsoluteExpiration { get; set; }
        public int PresenceMessageSlidingExpiration { get; set; }
        public bool IsScreensCacheEnabled { get; set; }
    }
}
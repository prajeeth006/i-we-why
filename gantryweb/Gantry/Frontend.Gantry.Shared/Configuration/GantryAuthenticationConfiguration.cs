namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryAuthenticationConfiguration
    {
        public string AuthenticationKey { get; }
        public bool EnableAuthentication { get; }
        public string RegexForCookieValue { get; }
    }
    public class GantryAuthenticationConfiguration: IGantryAuthenticationConfiguration
    {
        public string AuthenticationKey { get; set; }
        public bool EnableAuthentication { get; set; }
        public string RegexForCookieValue { get; set; }
    }
}
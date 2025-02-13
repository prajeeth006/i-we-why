namespace Frontend.Vanilla.Features.Login;

internal static class LoginType
{
    public const string BankId = "BankId";
    public const string OAuthId = "OAuthId";
    public const string ConnectCard = "Card";
    public const string RememberMe = "TemporaryOneTimePassword";
    public const string UsernameSubmit = "USERNAME_SUBMIT"; // used by portal, in this case password is empty. can be used later to improve validation if needed.
}

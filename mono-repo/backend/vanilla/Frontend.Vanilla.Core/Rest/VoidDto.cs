namespace Frontend.Vanilla.Core.Rest;

internal sealed class VoidDto
{
    public static readonly VoidDto Singleton = new ();
    private VoidDto() { }
}

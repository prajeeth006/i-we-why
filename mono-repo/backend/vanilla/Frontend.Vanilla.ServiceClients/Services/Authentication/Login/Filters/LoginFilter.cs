#nullable enable

using System.Threading.Tasks;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;

/// <summary>
/// Enables hooking into BeforeLogin and AfterLogin events.
/// </summary>
public interface ILoginFilter
{
    /// <summary>
    /// Enables execution before actual posapi login call.
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    Task BeforeLoginAsync(BeforeLoginContext context);

    /// <summary>
    /// Enables execution after actual posapi login call.
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    Task AfterLoginAsync(AfterLoginContext context);
}

internal abstract class LoginFilter : ILoginFilter
{
    public virtual Task BeforeLoginAsync(BeforeLoginContext context)
    {
        BeforeLogin(context);

        return Task.CompletedTask;
    }

    public virtual void BeforeLogin(BeforeLoginContext context) { }

    public virtual Task AfterLoginAsync(AfterLoginContext context)
    {
        AfterLogin(context);

        return Task.CompletedTask;
    }

    public virtual void AfterLogin(AfterLoginContext context) { }
}

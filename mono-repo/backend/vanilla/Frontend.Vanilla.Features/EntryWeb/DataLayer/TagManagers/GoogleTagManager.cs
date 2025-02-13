using System.Text;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.HtmlInjection;

namespace Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;

internal sealed class GoogleTagManager(ITrackingConfiguration config, IHtmlInjectionControlOverride htmlInjectionControlOverride)
    : ITagManager
{
    public bool IsEnabled
    {
        get
        {
            var x = htmlInjectionControlOverride.IsDisabled(HtmlInjectionKind.Gtm);
            var y = config.IsGoogleTagManagerEnabled;

            return y && !x;
        }
    }

    public bool ClientInjectionEnabled => config.UseClientInjection;

    public TrimmedRequiredString Name { get; } = "GoogleTagManagerRenderer";

    public string RenderBootstrapScript(bool skipClientInjectionConfigCheck = false)
    {
        var noScriptIframe = CreateNoScriptTag();

        if (ClientInjectionEnabled && !skipClientInjectionConfigCheck)
            return noScriptIframe;

        var script = new StringBuilder();
        script.AppendLine();
        script.AppendLine($"<script>{CreateClientScript()}</script>");
        script.Append(noScriptIframe);

        return script.ToString();
    }

    public string GetClientScript()
    {
        return CreateClientScript();
    }

    private string CreateClientScript()
    {
        var fullMarkup = new StringBuilder();
        fullMarkup.Append("(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],");
        fullMarkup.AppendLine(
            "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;j.addEventListener('load',function(){var _ge = new CustomEvent('gtm_loaded',{ bubbles: true });d.dispatchEvent(_ge);w[l].push({event:'vanilla_gtm_loaded'})});f.parentNode.insertBefore(j,f);})");
        fullMarkup.AppendLine($"(window,document,'script','{config.DataLayerName}','{config.GoogleTagManagerContainerId}');");

        return fullMarkup.ToString();
    }

    private string CreateNoScriptTag()
    {
        var noscriptIframe = new StringBuilder();
        noscriptIframe.Append("<noscript>");
        noscriptIframe.Append(
            $"<iframe height='0' width='0' style='display:none;visibility:hidden' src='//www.googletagmanager.com/ns.html?id={config.GoogleTagManagerContainerId}' />");
        noscriptIframe.Append("</noscript>");

        return noscriptIframe.ToString();
    }
}

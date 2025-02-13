using System.Text;

namespace Frontend.Vanilla.Features.EntryWeb.DataLayer;

internal interface IDataLayerRenderer
{
    string GetDataLayerMarkup();
}

internal sealed class DataLayerRenderer(ITrackingConfiguration config) : IDataLayerRenderer
{
    public string GetDataLayerMarkup()
    {
        var script = new StringBuilder();
        script.Append("<script type=\"text/javascript\">");
        script.Append($"var {config.DataLayerName} = [];");
        script.Append("</script>");

        return script.ToString();
    }
}

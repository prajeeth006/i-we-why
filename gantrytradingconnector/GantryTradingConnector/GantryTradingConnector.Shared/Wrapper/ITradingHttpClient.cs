namespace GantryTradingConnector.Shared.Wrapper
{
    public interface ITradingHttpClient:IDisposable
    {
        Task<HttpResponseMessage> GetRequestAsync(string requestUri);
    }
}

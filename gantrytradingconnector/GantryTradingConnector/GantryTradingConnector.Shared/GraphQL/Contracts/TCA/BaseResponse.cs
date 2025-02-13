namespace GantryTradingConnector.Shared.Contracts.TCA
{
    public abstract class BaseResponse<T>
    {
        public T Id { get; set; }

        public TranslatableString Name { get; set; }
    }

    public class TranslatableString
    {
        public string Value { get; set; }
    }
}

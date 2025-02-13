using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Date;

internal sealed class DateClientConfigProvider(IDateConfiguration dateConfiguration) : LambdaClientConfigProvider("vnDate",
    () => new
    {
        dateConfiguration.ShowMonthFirst,
        dateConfiguration.ShowMonthLongName,
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}

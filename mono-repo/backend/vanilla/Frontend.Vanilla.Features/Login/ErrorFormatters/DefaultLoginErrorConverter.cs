using System;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Login.ErrorFormatters;

internal interface IDefaultLoginErrorConverter : ILoginErrorConverter { }

internal sealed class DefaultLoginErrorConverter(ICurrentUserAccessor currentUserAccessor, ILogger<DefaultLoginErrorConverter> log) : IDefaultLoginErrorConverter
{
    public object Convert(object value, ErrorHandlerParameter parameter)
    {
        var converter = typeof(Convert).GetMethods(BindingFlags.Static | BindingFlags.Public)
            .FirstOrDefault(m =>
            {
                var parameters = m.GetParameters();

                return m.Name == "To" + parameter.Type && parameters.Length == 1 && parameters.First().ParameterType == typeof(string);
            });

        if (converter == null)
        {
            log.LogError("Converter with {name} has invalid {type}", parameter.Name, parameter.Type);

            return value;
        }

        var newValue = converter.Invoke(null, new[] { value });

        if (newValue is DateTime && !string.IsNullOrWhiteSpace(parameter.FromTimeZoneId) && !string.IsNullOrWhiteSpace(parameter.ToTimeZoneId))
        {
            try
            {
                var sourceTimeZone = TimeZoneInfo.FindSystemTimeZoneById(parameter.FromTimeZoneId);

                if (parameter.ToTimeZoneId.Equals("local", StringComparison.InvariantCultureIgnoreCase))
                {
                    var utcDateTime =
                        TimeZoneInfo.ConvertTime((DateTime)newValue, sourceTimeZone, TimeZoneInfo.Utc);
                    newValue = new UtcDateTime(utcDateTime).ToUserLocalTime(currentUserAccessor.User).DateTime;
                }
                else
                {
                    var destinationTimeZone = TimeZoneInfo.FindSystemTimeZoneById(parameter.ToTimeZoneId);
                    newValue = TimeZoneInfo.ConvertTime((DateTime)newValue, sourceTimeZone, destinationTimeZone);
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Timezone not found in system");
            }
        }

        return newValue!;
    }
}

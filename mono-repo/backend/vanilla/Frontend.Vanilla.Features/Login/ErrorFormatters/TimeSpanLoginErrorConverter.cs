using System;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Login.ErrorFormatters;

internal interface ITimeSpanLoginErrorConverter : ILoginErrorConverter { }

internal sealed class TimeSpanLoginErrorConverter(ILogger<TimeSpanLoginErrorConverter> log) : ITimeSpanLoginErrorConverter
{
    public object Convert(object value, ErrorHandlerParameter parameter)
    {
        var newValue = value;

        try
        {
            var timeSpanConverter = typeof(TimeSpan).GetMethods(BindingFlags.Static | BindingFlags.Public)
                .FirstOrDefault(m =>
                {
                    var parameters = m.GetParameters();

                    return m.Name == "From" + parameter.From && parameters.Length == 1 && parameters.First().ParameterType == typeof(double);
                });

            if (timeSpanConverter == null)
            {
                log.LogError("Invalid parameter for TimeSpan convert from. Value: {0}", parameter.From);

                return value;
            }

            var timeSpan = (TimeSpan?)timeSpanConverter.Invoke(null, new object[] { System.Convert.ToDouble(value) });
            var property = timeSpan?.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public).FirstOrDefault(p => p.Name == parameter.To);

            if (property == null)
            {
                log.LogError("Invalid parameter for TimeSpan convert to. Value: {0}", parameter.To);

                return value;
            }

            newValue = property.GetValue(timeSpan)!;

            return double.Parse(newValue.ToString()!) < 1 ? 1 : newValue;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Error while converting TimeSpan. ");
        }

        return newValue;
    }
}

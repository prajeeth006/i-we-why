using System;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Testing.Fakes;

internal static class TestTask
{
    public static Task<T> GetRunning<T>()
    {
        return Task.Run(() => // Just some dummy code that takes long
        {
            var counter = 0;

            for (var i = 0; i < 200; i++)
            {
                Thread.Sleep(100);
                counter++;
            }

            return default(T);
        });
    }

    public static Task GetUnique()
        => Task.FromResult(Guid.NewGuid());
}

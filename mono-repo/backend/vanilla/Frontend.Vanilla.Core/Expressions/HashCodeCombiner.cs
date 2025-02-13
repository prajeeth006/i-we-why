// Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.

using System.Collections;
using System.Diagnostics.CodeAnalysis;

namespace Frontend.Vanilla.Core.Expressions;

// based on System.Web.Util.HashCodeCombiner
[SuppressMessage("ReSharper", "SA1309", Justification = "Pasted code")]
internal class HashCodeCombiner
{
    private long combinedHash64 = 0x1505L;

    public int CombinedHash => combinedHash64.GetHashCode();

    public void AddFingerprint(ExpressionFingerprint? fingerprint)
    {
        if (fingerprint != null)
        {
            fingerprint.AddToHashCodeCombiner(this);
        }
        else
        {
            AddInt32(0);
        }
    }

    public void AddEnumerable(IEnumerable e)
    {
        if (e == null)
        {
            AddInt32(0);
        }
        else
        {
            var count = 0;

            foreach (var o in e)
            {
                AddObject(o);
                count++;
            }

            AddInt32(count);
        }
    }

    public void AddInt32(int i)
    {
        combinedHash64 = ((combinedHash64 << 5) + combinedHash64) ^ i;
    }

    public void AddObject(object o)
    {
        var hashCode = o != null ? o.GetHashCode() : 0;
        AddInt32(hashCode);
    }
}

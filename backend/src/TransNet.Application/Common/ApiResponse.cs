namespace TransNet.Application.Common;

public class ApiResponse<T>
{
    public T? Data { get; set; }
    public ResponseMeta? Meta { get; set; }
    public List<string>? Errors { get; set; }

    public static ApiResponse<T> Ok(T data, ResponseMeta? meta = null) =>
        new() { Data = data, Meta = meta };

    public static ApiResponse<T> Fail(string error) =>
        new() { Errors = new List<string> { error } };

    public static ApiResponse<T> Fail(IEnumerable<string> errors) =>
        new() { Errors = errors.ToList() };
}

public class ResponseMeta
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
